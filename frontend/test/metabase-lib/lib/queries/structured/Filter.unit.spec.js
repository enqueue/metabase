import Filter from "metabase-lib/lib/queries/structured/Filter";

import { ORDERS } from "__support__/sample_dataset_fixture";

const query = ORDERS.query();

function filter(mbql) {
  return new Filter(mbql, 0, query);
}

describe("Filter", () => {
  describe("displayName", () => {
    it("should return the correct string for an = filter", () => {
      expect(
        filter(["=", ["field-id", ORDERS.TOTAL.id], 42]).displayName(),
      ).toEqual("Total is equal to 42");
    });
    it("should return the correct string for a segment filter", () => {
      expect(filter(["segment", 1]).displayName()).toEqual("Expensive Things");
    });
  });
  describe("isValid", () => {
    describe("with a field filter", () => {
      it("should return true for a field that exists", () => {
        expect(filter(["=", ["field-id", ORDERS.TOTAL.id], 42]).isValid()).toBe(
          true,
        );
      });
      it("should return false for a field that doesn't exists", () => {
        expect(filter(["=", ["field-id", 12341234], 42]).isValid()).toBe(false);
      });
      it("should return true for a filter with an expression for the field", () => {
        expect(
          filter(["=", ["/", ["field-id", 12341234], 43], 42]).isValid(),
        ).toBe(true);
      });
    });
  });
  describe("operator", () => {
    it("should return the correct FilterOperator", () => {
      expect(
        filter(["=", ["field-id", ORDERS.TOTAL.id], 42]).operator().name,
      ).toBe("=");
    });
  });
  describe("setDimension", () => {
    it("should set the dimension for existing filter clause", () => {
      expect(
        filter(["=", ["field-id", ORDERS.SUBTOTAL.id], 42]).setDimension(
          ["field-id", ORDERS.TOTAL.id],
          {
            useDefaultOperator: true,
          },
        ),
      ).toEqual(["=", ["field-id", ORDERS.TOTAL.id], 42]);
    });
    it("should set the dimension for new filter clause", () => {
      expect(filter([]).setDimension(["field-id", ORDERS.TOTAL.id])).toEqual([
        null,
        ["field-id", ORDERS.TOTAL.id],
      ]);
    });
    it("should set the dimension and default operator for empty filter clauses", () => {
      expect(
        filter([]).setDimension(["field-id", ORDERS.TOTAL.id], {
          useDefaultOperator: true,
        }),
      ).toEqual(["=", ["field-id", ORDERS.TOTAL.id], undefined]);
    });
    it("should set the dimension correctly when changing from segment", () => {
      expect(
        filter(["segment", 1]).setDimension(["field-id", ORDERS.TOTAL.id]),
      ).toEqual([null, ["field-id", ORDERS.TOTAL.id]]);
    });
  });
});
