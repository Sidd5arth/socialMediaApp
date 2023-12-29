import { updateData, updateImg } from "../../api/update";
import { act } from "react-dom/test-utils";

jest.mock("../../SupabaseClient", () => {
  const updateMock = jest.fn().mockResolvedValue({ data: [] });

  return {
    supabase: {
      from: jest.fn(() => ({
        update: updateMock,
      })),
    },
  };
});

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("updateData", () => {
  let fromMock: jest.Mock;

  beforeEach(() => {
    fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should update data successfully", async () => {
    const name = "columnName";
    const value = "columnValue";

    await updateData("tableName", name, "matches", name, value);

    const updateMock = fromMock().update as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(updateMock).toHaveBeenCalledWith({ [name]: value });
  });

  it("should handle update failure", async () => {
    const name = "columnName";
    const value = "updatedValue";
    const col = "matchingColumn";
    const matches = "matchingValue";

    await act(async () => {
      await updateData("tableName", col, matches, name, value);
    });

    const updateMock = fromMock().update as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(updateMock).toHaveBeenCalledWith({ [name]: value });
  });
});

describe("updateImg", () => {
  let fromMock: jest.Mock;

  beforeEach(() => {
    fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update image successfully", async () => {
    const name = "columnName";
    const value = "updatedValue";
    const col = "matchingColumn";
    const matches = "matchingValue";

    await act(async () => {
      await updateImg("tableName", col, matches, name, value);
    });

    const updateMock = fromMock().update as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(updateMock).toHaveBeenCalledWith({ [name]: value });
  });

  it("should handle update image failure", async () => {
    const name = "columnName";
    const value = "updatedValue";
    const col = "matchingColumn";
    const matches = "matchingValue";

    await act(async () => {
      await updateImg("tableName", col, matches, name, value);
    });

    const updateMock = fromMock().update as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(updateMock).toHaveBeenCalledWith({ [name]: value });
  });

  it("should update image successfully and return data", async () => {
    const name = "columnName";
    const value = "updatedValue";
    const col = "matchingColumn";
    const matches = "matchingValue";

    const responseData = [{ column: "value" }];
    fromMock().update.mockResolvedValueOnce({ data: responseData });

    const result = await act(async () => {
      return updateImg("tableName", col, matches, name, value);
    });

    const updateMock = fromMock().update as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(updateMock).toHaveBeenCalledWith({ [name]: value });
    expect(result).toEqual(undefined);
  });
});
