# 2.1.1
## New features:
- Add support for `flow` parameter

# 2.1.0
## New features:
- Add support for `display` parameter to replace `low_bandwidth` option and additional options for `lite` and `waf`
- Add support for `username` parameter to pre-fill the username in the login form if it is known

## Fixes:
- refactor code to remove intermediate directory in lib


# 2.0.0

## **Breaking Changes**
- Drop support for Node versions before 4.x
- Drop support for OAuth 1(a) Legacy strategy

## New features:
- Support custom client signer if provided 
- Add `display` parameter for customizing display of sign in page 
- Add `username` parameter to help with post-registration login
- Add `icid` parameter for analytics

## Fixes:
- Example app updated to current Express and other dependencies


# 1.0.0

First public release
