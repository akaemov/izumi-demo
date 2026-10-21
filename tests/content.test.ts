import { test } from "node:test";
import assert from "node:assert/strict";
import {
  visibleMedia,
  filterApartments,
  media,
  type Apartment,
} from "../src/lib/content.ts";
test("public mode excludes every reference image", () => {
  assert.equal(visibleMedia(media, false).length, 0);
  assert.equal(visibleMedia(media, true).length, 3);
});
test("catalog filters confirmed inventory and availability", () => {
  const base: Apartment = {
    id: "test",
    rooms: 2,
    area: 60,
    floor: 3,
    price: null,
    available: true,
    status: "confirmed",
    plan: null,
  };
  const items = [
    base,
    { ...base, id: "sold", available: false },
    { ...base, id: "demo", status: "demo" as const },
  ];
  assert.deepEqual(
    filterApartments(items, "2", true).map((a) => a.id),
    ["test"],
  );
  assert.equal(filterApartments(items, "1", true).length, 0);
  assert.equal(filterApartments(items, "all", false).length, 2);
});

test("demo catalog is explicit and isolated from confirmed inventory", async () => {
  const { apartments } = await import("../src/lib/content.ts");
  assert.equal(apartments.length, 12);
  assert.equal(filterApartments(apartments, "all", false).length, 0);
  for (const rooms of ["0", "1", "2", "3"]) {
    const examples = filterApartments(apartments, rooms, true, true);
    assert.equal(examples.length, 3);
    assert.ok(
      examples.every(
        (a) =>
          a.status === "demo" && a.price === null && !a.available && a.plan,
      ),
    );
  }
});
