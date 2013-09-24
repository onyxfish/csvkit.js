describe("CSVKit.ObjectReader", function() {
    beforeEach(function() {
    });

    it("should parse types test data", function() {
        var reader = new CSVKit.ObjectReader();
        reader.parse(MOCK_CSV_DATA.types);

        expect(reader.column_names).toEqual(["text", "date", "integer", "boolean", "float", "time", "datetime", "empty_column", ""]);
        expect(reader.rows[0]).toEqual({ "text": "Chicago Reader", "date": "1/1/1971", "integer": "40", "boolean": "TRUE", "float": "1", "time": "04:14:00 AM", "datetime": "01/01/71 04:14 AM", "empty_column": "", "": "" });
        expect(reader.rows.length).toEqual(5);
    });
});
