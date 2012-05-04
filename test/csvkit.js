describe("CSVKit.Reader", function() {
    beforeEach(function() {
    });

    it("should parse types test data", function() {
        var reader = new CSVKit.Reader();
        reader.parse(MOCK_CSV_DATA.types);

        expect(reader.column_names).toEqual(["text", "date", "integer", "boolean", "float", "time", "datetime", "empty_column", ""]);
        expect(reader.rows[0]).toEqual(["Chicago Reader", "1/1/1971", "40", "TRUE", "1", "04:14:00 AM", "01/01/71 04:14 AM", "", ""]);
        expect(reader.rows[1]).toEqual(["Chicago Sun-Times", "1/1/1948", "63", "TRUE", "1.27", "02:57:13 PM", "01/01/48 02:57 PM", ""]);
        expect(reader.rows[2]).toEqual(["Chicago Tribune", "1/1/1920", "164", "FALSE", "41800000.01", "12:00:00 AM", "01/01/20 12:00 AM", "", ""]);
        expect(reader.rows[3]).toEqual(["This row has blanks", "", "", "", "", "", "", "", ""]);
        expect(reader.rows[4]).toEqual(["Unicode! Σ", "", "", "", "", "", "", ""]);
    });
});
