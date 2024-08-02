import { expect } from "chai";

describe("url shortener api", () => {
  describe("it should not be able to create a shortned url without a valid url", () => {
    it("should return status code 400", () => {
      fetch(`http://localhost:3000/shorten-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "foobar",
        }),
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  describe("it should be able to create a shortned url", () => {
    it("should return status code 201", () => {
      fetch(`http://localhost:3000/shorten-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "https://www.google.com",
        }),
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.exist();
      });
    });
  });

  describe("it should not be able to be redirected in a invalid or inexistent shortned url", () => {
    it("should return status code 404", () => {
      fetch(`http://localhost:3000/foobar`).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe("it should be able to be redirected in a valid shortned url", () => {
    it("should return status code 301", () => {
      fetch(`http://localhost:3000/shorten-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "https://www.google.com",
        }),
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.exist();
        fetch(`${response.body.data.url}`).then((response) => {
          expect(response.status).to.equal(301);
        });
      });
    });
  });

  describe("it should be able to get metrics of a valid shortned url", () => {
    it("should return status code 200", () => {
      fetch(`http://localhost:3000/shorten-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "https://www.google.com",
        }),
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.exist();
        const prefix = response.url.split("/")[3];
        fetch(`http://localhost:3000/metrics?prefix=${prefix}`).then(
          (response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.exist();
          }
        );
      });
    });
  });
});
