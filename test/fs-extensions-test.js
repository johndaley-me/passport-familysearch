'use strict';

const chai = require('chai');
chai.use(require('chai-passport-strategy'));
const expect = chai.expect;
const url = require('url');

const FamilySearchStrategy = require('../lib/strategy');

describe('FamilySearchStrategy familysearch.org-specific extensions', function () {
  let redirect, params;
  const USERNAME = 'l()ñg, ç;®@#? us=rn@m()';

  before(function (done) {
    const mockSigner = function () {
      return 'mockSignedValue';
    };
    const strategy = new FamilySearchStrategy({
      devKey: 'ABC123',
      signer: mockSigner
    }, function () {});

    strategy._oauth2._request = function (method, url, headers, post_body, access_token, callback) {
      switch (url) {
        case 'https://ident.familysearch.org/cis-web/oauth2/v3/token':
          const tokenBody = {
            access_token: 'mockAccessToken',
            token_type: 'family_search'
          };
          callback(null, JSON.stringify(tokenBody), undefined);
          break;
        case 'https://api.familysearch.org/platform/users/current':
          const profileBody = '{"users":[{"id":"ABCD-1234","contactName":"Sandbox Account","email":"noreply@familysearch.org","links":{"self":{"href":"https://api-integ.familysearch.org/platform/users/current"}}}]}';
          callback(null, profileBody, undefined);
          break;
        default:
          callback(new Error(`Could not find matching mock URL for ${url}`));
          break;
      }
    };

    chai.passport.use(strategy)
      .redirect(function (redirectUrl, status) {
        redirect = redirectUrl;
        params = url.parse(redirectUrl, true).query;
        done();
      })
      .authenticate({referrer: 'example.com', display: 'lite', userName: USERNAME, icid: 'abc.123-my_cid'});
  });

  it('should pass through referrer option', function () {
    expect(params).to.have.property('referrer', 'example.com');
  });

  it('should pass through icid option', function () {
    expect(params).to.have.property('icid', 'abc.123-my_cid');
  });

  it('should pass through display and low bandwidth option', function () {
    expect(params).to.have.property('display', 'lite');
    expect(params).to.have.property('low_bandwidth', 'true');
  });

  it('should pass through userName option', function () {
    expect(redirect).to.include(encodeURIComponent(USERNAME));
    expect(params.userName).to.eql(USERNAME);
    expect(params).to.not.have.property('username');
  });

  it('should set client_secret with custom signing function', function () {
    expect(params.client_secret).to.eql('mockSignedValue');
  });

});
