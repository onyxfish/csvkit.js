describe("csvreader", function() {
    beforeEach(function() {
    });

    it("should parse types test data", function() {
        var reader = new CSV.csvreader();
        reader.parse(MOCK_CSV_DATA.types);

        expect(reader.column_names).toEqual(["text", "date", "integer", "boolean", "float", "time", "datetime", "empty_column", ""]);
        expect(reader.rows[0], ["Chicago Reader", "1/1/1971", "40", "TRUE", "1", "04:14:00 AM,01/01/71 04:14 AM", "", ""]);
    });
});
