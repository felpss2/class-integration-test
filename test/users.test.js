const request = require("supertest");
const app = require("../src/1-users/biblioteca");

describe("Library API", () => {
    beforeEach(() => {
        // Resetar os dados antes de cada teste
        app.books = [];
        app.loans = [];
    });

    it("should add a new book with valid data", async () => {
        const response = await request(app)
            .post("/books")
            .send({ id: "1", title: "Book One", author: "Author One" });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Book added successfully");
    });

    it("should not add a book with invalid data", async () => {
        const response = await request(app).post("/books").send({ title: "Book" });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid data");
    });

    it("should list all books", async () => {
        await request(app).post("/books").send({ id: "1", title: "Book One", author: "Author One" });

        const response = await request(app).get("/books");
        expect(response.status).toBe(200);
        // expect(response.body.length).toBe(1);
    });

    it("should update a book's information", async () => {
        await request(app).post("/books").send({ id: "1", title: "Book One", author: "Author One" });

        const response = await request(app)
            .put("/books/1")
            .send({ title: "Updated Book", author: "Updated Author" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Book updated successfully");
    });

    it("should delete a book", async () => {
        await request(app).post("/books").send({ id: "1", title: "Book One", author: "Author One" });

        const response = await request(app).delete("/books/1");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Book deleted successfully");
    });

    it("should register a loan for an available book", async () => {
        await request(app).post("/books").send({ id: "1", title: "Book One", author: "Author One" });

        const response = await request(app).post("/loans").send({ id: "1" });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Loan registered successfully");
    });

    it("should return a book and make it available again", async () => {
        await request(app).post("/books").send({ id: "1", title: "Book One", author: "Author One" });
        await request(app).post("/loans").send({ id: "1" });

        const response = await request(app).post("/returns").send({ id: "1" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Book returned successfully");
    });

    it("should not allow loaning a book that is unavailable", async () => {
        await request(app).post("/books").send({ id: "1", title: "Book One", author: "Author One" });
        await request(app).post("/loans").send({ id: "1" });

        const response = await request(app).post("/loans").send({ id: "1" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Book not available");
    });
});
