describe("CSVKit.Writer", function() {
    beforeEach(function() {
    });

    it("should write rows", function() {
        var writer = new CSVKit.Writer();
        var output = writer.write([
            ['a', 'b', 'c'],
            ['oneword', 'two words', 'three words ?']
        ]);

        expect(output).toEqual('a,b,c\noneword,two words,three words ?');
    });

    it("should escape quotes", function() {
        var writer = new CSVKit.Writer();

        var output = writer.write([
            ['a,', 'b', 'c '],
            ['oneword', 'two words', 'three words ?']
        ]);

        expect(output).toEqual('"a,",b,c \noneword,two words,three words ?');
    });

});
