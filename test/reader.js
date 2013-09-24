describe("CSVKit.Reader", function() {
    beforeEach(function() {
    });

    it("should parse unquoted data", function() {
        var reader = new CSVKit.Reader();
        reader.parse('a,b,c\noneword,two words,three words ?');

        expect(reader.column_names).toEqual(["a", "b", "c"]);
        expect(reader.rows[0]).toEqual(["oneword", "two words", "three words ?"]);
    });

    it("should parse fully quoted data", function() {
        var reader = new CSVKit.Reader();
        reader.parse('"a",b,"c"\noneword,"two words",three words ?');

        expect(reader.column_names).toEqual(["a", "b", "c"]);
        expect(reader.rows[0]).toEqual(["oneword", "two words", "three words ?"]);
    });

    it("should parse partially quoted data", function() {
        var reader = new CSVKit.Reader();
        reader.parse('"a","b","c"\n"oneword","two words","three words ?"');

        expect(reader.column_names).toEqual(["a", "b", "c"]);
        expect(reader.rows[0]).toEqual(["oneword", "two words", "three words ?"]);
    });

    it("should handle Unix line endings", function() {
        var reader = new CSVKit.Reader();
        reader.parse('a,b,c\n1,2,3\n4,5,6');

        expect(reader.column_names).toEqual(["a", "b", "c"]);
        expect(reader.rows.length).toEqual(2);
    });

    it("should handle Windows line endings", function() {
        var reader = new CSVKit.Reader();
        reader.parse('a,b,c\r\n1,2,3\r\n4,5,6');

        expect(reader.column_names).toEqual(["a", "b", "c"]);
        expect(reader.rows.length).toEqual(2);
    });

    it("should handle Mac line endings", function() {
        var reader = new CSVKit.Reader();
        reader.parse('a,b,c\r1,2,3\r4,5,6');

        expect(reader.column_names).toEqual(["a", "b", "c"]);
        expect(reader.rows.length).toEqual(2);
    });

    it("should process header as column names", function() {
        var reader = new CSVKit.Reader();
        reader.parse('a,b,c\r1,2,3\r4,5,6');

        expect(reader.column_names).toEqual(["a", "b", "c"]);
        expect(reader.rows.length).toEqual(2);
    });

    it("should not process header as column names", function() {
        var reader = new CSVKit.Reader({
            columns_from_header: false                             
        });
        reader.parse('a,b,c\r1,2,3\r4,5,6');

        expect(reader.column_names).toEqual([]);
        expect(reader.rows.length).toEqual(3);
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
