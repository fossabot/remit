/* global describe, it, expect, sinon, remit */

describe('Holistic request/response', function () {
  const callback = sinon.spy()
  const callback2 = sinon.spy()
  let endpoint
  let request

  describe('#endpoint', function () {
    it('should set up an endpoint', function (done) {
      endpoint = remit
        .endpoint('holistic.request.response')
        .ready(done)

      expect(endpoint.ready).to.be.a('function')
      expect(endpoint.data).to.be.a('function')
    })

    it('should add three data callbacks', function () {
      const handler = function (event, done) {
        event.data.bar = 'baz'

        return done(null, event.data)
      }

      endpoint
        .data(callback)
        .data(callback2)
        .data(handler)

      expect(endpoint._emitter._events.data).to.be.an('array')
      expect(endpoint._emitter._events.data).to.have.lengthOf(3)
      expect(endpoint._emitter._events.data[0].fn).to.equal(callback)
      expect(endpoint._emitter._events.data[1].fn).to.equal(callback2)
      expect(endpoint._emitter._events.data[2].fn).to.equal(handler)
    })
  })

  describe('#request', function () {
    it('should set up a request', function () {
      request = remit.request('holistic.request.response')

      expect(request).to.be.a('function')
      expect(request.send).to.equal(request)
      expect(request.data).to.be.a('function')
      expect(request.sent).to.be.a('function')
    })

    it('should add a data callback to the request', function () {
      const handler = function (err, result) {
        expect(err).to.equal(null)
        expect(result).to.be.an('object')
        expect(result.foo).to.equal('bar')
        expect(result.bar).to.equal('baz')
      }

      request.data(handler)

      expect(request._emitter._events.data).to.be.an('object')
      expect(request._emitter._events.data.fn).to.equal(handler)
    })

    it('should request data from the endpoint', function (done) {
      request
        .data(() => {
          expect(callback).to.have.been.called
          expect(callback2).to.have.been.called

          return done()
        })
        .send({foo: 'bar'})
    })
  })
})
