import { test, describe } from "node:test";
import assert from "node:assert";
import { reducer, actionTypes, TOAST_LIMIT } from "./toast-reducer.js";

describe("toast-reducer", () => {
  const initialState = { toasts: [] };

  test("ADD_TOAST adds a toast to the state", () => {
    const toast = { id: "1", title: "Test Toast" };
    const action = { type: actionTypes.ADD_TOAST, toast };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.deepStrictEqual(newState.toasts[0], toast);
  });

  test("ADD_TOAST respects TOAST_LIMIT", () => {
    let state = initialState;
    for (let i = 0; i < TOAST_LIMIT + 5; i++) {
      state = reducer(state, {
        type: actionTypes.ADD_TOAST,
        toast: { id: i.toString() },
      });
    }

    assert.strictEqual(state.toasts.length, TOAST_LIMIT);
    assert.strictEqual(state.toasts[0].id, (TOAST_LIMIT + 4).toString());
  });

  test("UPDATE_TOAST updates an existing toast", () => {
    const state = {
      toasts: [
        { id: "1", title: "Old Title" },
        { id: "2", title: "Other Toast" },
      ],
    };
    const action = {
      type: actionTypes.UPDATE_TOAST,
      toast: { id: "1", title: "New Title" },
    };
    const newState = reducer(state, action);

    assert.strictEqual(newState.toasts.find((t) => t.id === "1").title, "New Title");
    assert.strictEqual(newState.toasts.find((t) => t.id === "2").title, "Other Toast");
  });

  test("DISMISS_TOAST sets open to false for a specific toast", () => {
    const state = {
      toasts: [
        { id: "1", open: true },
        { id: "2", open: true },
      ],
    };
    let addedToRemoveQueueId = null;
    const addToRemoveQueue = (id) => {
      addedToRemoveQueueId = id;
    };

    const action = { type: actionTypes.DISMISS_TOAST, toastId: "1" };
    const newState = reducer(state, action, { addToRemoveQueue });

    assert.strictEqual(newState.toasts.find((t) => t.id === "1").open, false);
    assert.strictEqual(newState.toasts.find((t) => t.id === "2").open, true);
    assert.strictEqual(addedToRemoveQueueId, "1");
  });

  test("DISMISS_TOAST sets open to false for all toasts when no toastId is provided", () => {
    const state = {
      toasts: [
        { id: "1", open: true },
        { id: "2", open: true },
      ],
    };
    const addedIds = [];
    const addToRemoveQueue = (id) => {
      addedIds.push(id);
    };

    const action = { type: actionTypes.DISMISS_TOAST };
    const newState = reducer(state, action, { addToRemoveQueue });

    assert.ok(newState.toasts.every((t) => t.open === false));
    assert.deepStrictEqual(addedIds.sort(), ["1", "2"].sort());
  });

  test("REMOVE_TOAST removes a specific toast", () => {
    const state = {
      toasts: [
        { id: "1" },
        { id: "2" },
      ],
    };
    const action = { type: actionTypes.REMOVE_TOAST, toastId: "1" };
    const newState = reducer(state, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.strictEqual(newState.toasts[0].id, "2");
  });

  test("REMOVE_TOAST removes all toasts when no toastId is provided", () => {
    const state = {
      toasts: [
        { id: "1" },
        { id: "2" },
      ],
    };
    const action = { type: actionTypes.REMOVE_TOAST };
    const newState = reducer(state, action);

    assert.strictEqual(newState.toasts.length, 0);
  });

  test("returns current state for unknown action type", () => {
    const state = { toasts: [{ id: "1" }] };
    const newState = reducer(state, { type: "UNKNOWN" });
    assert.strictEqual(newState, state);
  });
});
