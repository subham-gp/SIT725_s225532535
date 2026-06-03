const { expect } = require('chai');
const request = require('request');
const { server, calculateFinalBuyingPrice } = require('../server');

const baseUrl = 'http://localhost:3000/api';

describe('Muscle Car Application Unit & Integration Tests', () => {

    after((done) => {
        server.close(() => {
            done();
        });
    });

    //Calculation Function 
    describe('Unit Tests: calculateFinalBuyingPrice()', () => {

        //Test Case 1: Valid Behaviour
        it('should correctly calculate markdown deductions for valid values', () => {
            const result = calculateFinalBuyingPrice(100, 15);
            expect(result).to.equal(85.00);
        });

        //Test Case 2: Invalid Behaviour
        it('should return 0 safely if negative percentages are provided', () => {
            const result = calculateFinalBuyingPrice(100, -5);
            expect(result).to.equal(0);
        });

        //Test Case 3: Boundary Edge Case
        it('should correctly handle a maximum boundary discount of 100%', () => {
            const result = calculateFinalBuyingPrice(500, 100);
            expect(result).to.equal(0.00); // 100% off makes it free
        });
    });

    //REST API endpoint 
    describe('Integration Tests: GET /api/calculate-discount', () => {

        //Test Case 4: Valid Behaviour
        it('should return status code 200 and return the compiled data matrix for valid inputs', (done) => {
            request(`${baseUrl}/calculate-discount?price=200&discount=10`, (error, response, body) => {
                const parsedBody = JSON.parse(body);
                expect(response.statusCode).to.equal(200);
                expect(parsedBody.finalPrice).to.equal(180);
                done();
            });
        });

        //Test Case 5: Invalid Behaviour
        it('should gracefully handle non-numeric text inputs without crashing', (done) => {
            request(`${baseUrl}/calculate-discount?price=abc&discount=abc`, (error, response, body) => {
                expect(response.statusCode).to.not.equal(500); // Ensures server doesn't throw an unhandled internal crash
                done();
            });
        });

        //Test Case 6: Edge Case Behaviour
        it('should handle completely empty query parameters gracefully', (done) => {
            request(`${baseUrl}/calculate-discount`, (error, response, body) => {
                expect(response.statusCode).to.not.equal(500);
                done();
            });
        });
    });
});