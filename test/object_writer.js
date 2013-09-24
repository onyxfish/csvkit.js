describe("CSVKit.ObjectWriter", function() {
    beforeEach(function() {
    });

    it("should write rows", function() {
        var writer = new CSVKit.ObjectWriter({
            column_names: ['a', 'b', 'c']
        });

        var output = writer.write([
            { 'a': 'oneword', 'b': 'two words', 'c': 'three words ?' }
        ]);

        expect(output).toEqual('a,b,c\noneword,two words,three words ?');
    });

    it("should escape quotes", function() {
        var writer = new CSVKit.ObjectWriter({
            column_names: ['a,', 'b\n', 'c ']
        });

        var output = writer.write([
            { 'a,': 'oneword', 'b\n': 'two words', 'c ': 'three words ?' }
        ]);

        expect(output).toEqual('"a,","b\n",c \noneword,two words,three words ?');
    });
});

