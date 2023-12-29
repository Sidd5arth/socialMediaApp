import { deleteData } from "../../api/delete";
import { act } from "react-dom/test-utils";
import { render } from "@testing-library/react";

jest.mock("../../SupabaseClient", () => {
  const fromMock = jest.fn(() => ({
    delete: jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ error: null }),
    })),
  }));

  return {
    supabase: {
      from: fromMock,
    },
  };
});

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

type ToastMock = {
  success: jest.Mock;
  error: jest.Mock;
};

const toastMock: ToastMock = jest.requireMock("react-hot-toast").toast;

describe("deleteData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete data successfully", async () => {
    await act(async () => {
      await deleteData("tableName", "columnName", "matchingValue");
    });

    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    const deleteMock = fromMock.mock.results[0].value.delete as jest.Mock;
    const eqMock = deleteMock.mock.results[0].value.eq as jest.Mock;

    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("columnName", "matchingValue");

    expect(toastMock.success).toHaveBeenCalledWith(
      "tableName deleted successfully"
    );
  });

  it("should handle delete failure", async () => {
    jest.mock("../../SupabaseClient", () => {
      const deleteMock = jest.fn();
      const eqMock = jest.fn(() => ({
        error: new Error("Delete failed"),
      }));

      const fromMock = jest.fn(() => ({
        delete: deleteMock,
        eq: eqMock,
      }));

      return {
        supabase: {
          from: fromMock,
        },
      };
    });

    await deleteData("tableName", "columnName", "matchingValue");

    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    const deleteMock = fromMock.mock.results[0].value.delete as jest.Mock;
    const eqMock = deleteMock.mock.results[0].value.eq as jest.Mock;

    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("columnName", "matchingValue");
  });
});
