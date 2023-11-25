import {Tuple} from "./template.model";

describe('template.model.spec', () => {

    it('a template test', () => {
        // GIVEN
        const tupleA = new Tuple(1, 2, 3, 4);
        let tupleB: Tuple;

        // WHEN
        tupleB = new Tuple(2, 4, 6, 8);

        // THEN
        expect(true).toEqual(true);
        expect(tupleA.equals(tupleB)).toBeFalsy()
    });

});
