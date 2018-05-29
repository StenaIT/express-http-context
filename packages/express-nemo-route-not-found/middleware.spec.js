const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-route-not-found', () => {
  context('configuration', () => {
    context('invalid', () => {
      context('when no notFoundResponse template is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              notFoundResponseTemplate: null
            })
          ).to.throw()
        })
      })
    })

    context('valid', () => {
      context('minimum configuration', () => {
        it('returns middleware with options exposed', () => {
          let mw = middleware()
          expect(mw.options).to.not.be.undefined
        })
      })

      context('default notFoundResponseTemplate', () => {
        it('produces a string', () => {
          const responseTemplate = middleware().options.notFoundResponseTemplate
          const req = {
            method: 'GET',
            url: '/'
          }
          const res = {
            statusCode: 404
          }
          let clientResponse = responseTemplate(req, res)
          expect(clientResponse).to.equal(
            "Not Found '404' - No route matching path '/' was found"
          )
        })
      })
    })
  })
  context('middleware is called', () => {
    let nextCalled
    let callArgs
    let sendCalled
    let SUT
    let req = {}
    let res = {
      statusCode: 200,
      send: data => {
        sendCalled = true
        return res
      },
      status: code => {
        res.statusCode = code
        return res
      }
    }

    const next = () => {
      nextCalled = true
    }

    beforeEach(() => {
      nextCalled = false
      sendCalled = false
      SUT = middleware({
        notFoundResponseTemplate: () => {
          return {}
        }
      })
    })

    it('calls next', () => {
      SUT(req, res, next)
      expect(nextCalled).to.be.true
    })

    it('passes 404 as status code', () => {
      SUT(req, res, next)
      expect(res.statusCode).to.equal(404)
    })

    it('passes clientResponse to client', () => {
      SUT(req, res, next)
      expect(sendCalled).to.equal(true)
    })

    it('calls the notFoundResponseTemplate with request and response', () => {
      let calledCorrectly

      mw = middleware({
        notFoundResponseTemplate: (request, response) =>
          (calledCorrectly = request === req && response === res)
      })
      mw(req, res, next)
      expect(calledCorrectly).to.be.true
    })
  })
})
