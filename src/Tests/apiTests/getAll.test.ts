import { getAll, getAllPaginated, getData } from "../../api/getAll"; // Update the path accordingly
import { act } from "react-dom/test-utils";

jest.mock("../../SupabaseClient", () => {
  const fromMock = jest.fn(() => ({
    select: jest.fn(() => ({
      range: jest.fn(() => ({
        order: jest.fn(() => ({
          ascending: jest.fn(() => ({
            get: jest.fn().mockResolvedValue({ data: [] }),
          })),
        })),
      })),
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
    error: jest.fn(),
  },
}));

type ToastMock = {
  error: jest.Mock;
};

const toastMock: ToastMock = jest.requireMock("react-hot-toast").toast;

describe("getAllPaginated", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch paginated data successfully", async () => {
    await act(async () => {
      const result = await getAllPaginated("tableName", 0, 10);
      expect(result).toEqual(null);
    });

    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
  });

  it("should handle fetching paginated data failure", async () => {
    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    fromMock()
      .select()
      .range()
      .order()
      .ascending()
      .get.mockRejectedValueOnce(new Error("Fetch failed"));

    await act(async () => {
      const result = await getAllPaginated("tableName", 0, 10);
      expect(result).toBeNull();
    });

    expect(fromMock).toHaveBeenCalledWith("tableName");

    expect(toastMock.error).toHaveBeenCalledWith("Error in fetching the data");
  });
});

describe("getAll", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all data successfully", async () => {
    await act(async () => {
      const result = await getAll("tableName");
      expect(result).toEqual(null);
    });

    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
  });

  it("should handle fetching all data failure", async () => {
    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    fromMock()
      .select()
      .range()
      .order()
      .ascending()
      .get.mockRejectedValueOnce(new Error("Fetch failed"));

    await act(async () => {
      const result = await getAll("tableName");
      expect(result).toBeNull();
    });

    expect(fromMock).toHaveBeenCalledWith("tableName");

    expect(toastMock.error).toHaveBeenCalledWith("Error in fetching the data");
  });
});

describe("getData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch profile data successfully", async () => {
    await act(async () => {
      const result = await getData("tableName");
      expect(result).toEqual(null);
    });

    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
  });

  it("should handle fetching profile data failure", async () => {
    const fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
    fromMock()
      .select()
      .range()
      .order()
      .ascending()
      .get.mockRejectedValueOnce(new Error("Fetch failed"));

    await act(async () => {
      const result = await getData("tableName");
      expect(result).toBeNull();
    });

    expect(fromMock).toHaveBeenCalledWith("tableName");

    expect(toastMock.error).toHaveBeenCalledWith("Error in fetching the data");
  });
});
