const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

const results = [];
const coverageTracker = {
    CREATE_FAIL: 0,
    UPDATE_FAIL: 0,
    TYPE: 0,
    REQUIRED: 0,
    BOUNDARY: 0,
    LENGTH: 0,
    TEMPORAL: 0,
    UNKNOWN_CREATE: 0,
    UNKNOWN_UPDATE: 0,
    IMMUTABLE: 0,
};

//Creates a valid book object for testing
function makeValidBook(id) {
    return {
        id: id,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Classic",
        summary: "A classic story about the American Dream.", // > 10 chars
        price: 29.99 // > 0
    };
}

function makeValidUpdate() {
    return {
        title: "Updated Title",
        price: 19.99
    };
}

//For running individual tests and logging results
async function test({ id, name, method, path, body, expected, tags }) {
    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });

        const success = response.status === expected;
        results.push({ id, name, success, actual: response.status, expected });

        if (success) {
            tags.forEach((tag) => {
                if (coverageTracker.hasOwnProperty(tag)) coverageTracker[tag]++;
            });
        }

        console.log(`TEST|${id}|${name}|${success ? "PASS" : "FAIL"}|${response.status}`);
    } catch (err) {
        console.log(`TEST|${id}|${name}|ERROR|${err.message}`);
    }
}

//Execute different test cases
async function runTests() {
    const uniqueId = `test-${Date.now()}`;
    const createPath = API_BASE;
    const updatePath = (id) => `${API_BASE}/${id}`;

    console.log("SIT725_VALIDATION_TESTS START");

    //Test1 Valid Create
    await test({
        id: "T01",
        name: "Valid Create",
        method: "POST",
        path: createPath,
        expected: 201,
        body: makeValidBook(uniqueId),
        tags: []
    });

    //Test2 Duplicate ID (Conflict)
    await test({
        id: "T02",
        name: "Duplicate ID",
        method: "POST",
        path: createPath,
        expected: 409,
        body: makeValidBook(uniqueId),
        tags: ["CREATE_FAIL"]
    });

    //Test3 Immutable ID (Update)
    await test({
        id: "T03",
        name: "Immutable ID on update",
        method: "PUT",
        path: updatePath(uniqueId),
        expected: 400,
        body: { ...makeValidUpdate(), id: "new-id-attempt" },
        tags: ["UPDATE_FAIL", "IMMUTABLE"]
    });

    //Test4 Unknown Field Create
    await test({
        id: "T04",
        name: "Unknown field CREATE",
        method: "POST",
        path: createPath,
        expected: 400,
        body: { ...makeValidBook(`${uniqueId}-extra`), malicious_field: "hacked" },
        tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
    });

    //Test5 Title too short
    await test({
        id: "T05",
        name: "Length: Title too short",
        method: "POST",
        path: createPath,
        expected: 400,
        body: { ...makeValidBook(`${uniqueId}-short`), title: "Ab" },
        tags: ["CREATE_FAIL", "LENGTH"]
    });

    //Test6 Future Year
    await test({
        id: "T06",
        name: "Temporal: Future Year",
        method: "POST",
        path: createPath,
        expected: 400,
        body: { ...makeValidBook(`${uniqueId}-future`), year: 2099 },
        tags: ["CREATE_FAIL", "TEMPORAL"]
    });

    //Test7 Negative Price
    await test({
        id: "T07",
        name: "Boundary: Negative Price",
        method: "POST",
        path: createPath,
        expected: 400,
        body: { ...makeValidBook(`${uniqueId}-neg`), price: -5.00 },
        tags: ["CREATE_FAIL", "BOUNDARY"]
    });

    //Test8 Type/Enum - Invalid Genre
    await test({
        id: "T08",
        name: "Type: Invalid Genre Enum",
        method: "POST",
        path: createPath,
        expected: 400,
        body: { ...makeValidBook(`${uniqueId}-genre`), genre: "Cyberpunk" },
        tags: ["CREATE_FAIL", "TYPE"]
    });

    //Test9 Required Field - Missing Author
    await test({
        id: "T09",
        name: "Required: Missing Author",
        method: "POST",
        path: createPath,
        expected: 400,
        body: { id: "T09-id", title: "Missing Author", year: 2020, genre: "Classic", price: 10, summary: "Valid summary here" },
        tags: ["CREATE_FAIL", "REQUIRED"]
    });

    //Test10 Unknown field UPDATE
    await test({
        id: "T10",
        name: "Unknown field UPDATE",
        method: "PUT",
        path: updatePath(uniqueId),
        expected: 400,
        body: { ...makeValidUpdate(), unexpected: "data" },
        tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
    });

    //Final Report
    console.log("\nSUMMARY_TABLE");
    console.table(results);

    console.log("\nCOVERAGE_REPORT");
    Object.keys(coverageTracker).forEach(key => {
        console.log(`COVERAGE|${key}|${coverageTracker[key]}`);
    });

    const allCovered = Object.values(coverageTracker).every(v => v > 0);
    console.log(`\nOVERALL_RESULT: ${allCovered ? "PASS (Distinction Criteria Met)" : "FAIL (Check Coverage)"}`);

    process.exit(allCovered ? 0 : 1);
}

runTests();