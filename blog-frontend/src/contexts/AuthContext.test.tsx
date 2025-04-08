import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Mock component to test the useAuth hook
const TestComponent = () => {
  const { user, token, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : "no user"}</div>
      <div data-testid="token">{token || "no token"}</div>
      <button
        data-testid="login-button"
        onClick={() =>
          login("test-token", {
            id: "1",
            name: "Test User",
            email: "test@example.com",
          })
        }>
        Login
      </button>
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("provides initial authentication state", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("no user");
    expect(screen.getByTestId("token")).toHaveTextContent("no token");
  });

  it("updates state on login and stores in localStorage", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId("login-button").click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("Test User");
    expect(screen.getByTestId("token")).toHaveTextContent("test-token");
    expect(localStorage.getItem("token")).toBe("test-token");
    expect(localStorage.getItem("user")).toBe(
      JSON.stringify({
        id: "1",
        name: "Test User",
        email: "test@example.com",
      })
    );
  });

  it("clears state on logout and removes from localStorage", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    act(() => {
      screen.getByTestId("login-button").click();
    });

    // Then logout
    act(() => {
      screen.getByTestId("logout-button").click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("no user");
    expect(screen.getByTestId("token")).toHaveTextContent("no token");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
