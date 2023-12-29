import { insertData } from "../../api/insert";
import { act } from "react-dom/test-utils";

jest.mock("../../SupabaseClient", () => {
  const insertMock = jest.fn().mockResolvedValue({ data: [] });

  return {
    supabase: {
      from: jest.fn(() => ({
        insert: insertMock,
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

type ToastMock = {
  success: jest.Mock;
  error: jest.Mock;
};

const toastMock: ToastMock = jest.requireMock("react-hot-toast").toast;

describe("insertData", () => {
  let fromMock: jest.Mock;

  beforeEach(() => {
    fromMock = require("../../SupabaseClient").supabase.from as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should insert data successfully", async () => {
    const payload = [{ created_by: "sadsa", post_id: "qwre", content: "afe" }];

    await act(async () => {
      await insertData("tableName", payload);
    });

    const insertMock = fromMock().insert as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(insertMock).toHaveBeenCalledWith(payload);

    expect(toastMock.success).toHaveBeenCalledWith("tableName created");
  });

  it("should handle insert failure", async () => {
    const payload = [{ created_by: "sadsa", post_id: "qwre", content: "afe" }];

    fromMock().insert.mockRejectedValueOnce(new Error("Insert failed"));

    await act(async () => {
      await insertData("tableName", payload);
    });

    const insertMock = fromMock().insert as jest.Mock;
    expect(fromMock).toHaveBeenCalledWith("tableName");
    expect(insertMock).toHaveBeenCalledWith(payload);

    expect(toastMock.error).toHaveBeenCalledWith("tableName failed");
  });
});
