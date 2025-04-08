import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Login from "../pages/Login";
import "@testing-library/jest-dom";

describe("Authentication Flow", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("renders login page with social login buttons", () => {
    const { getByText } = render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(getByText("Welcome to BlogApp")).toBeInTheDocument();
    expect(getByText("Continue with Google")).toBeInTheDocument();
    expect(getByText("Continue with Facebook")).toBeInTheDocument();
  });

  it("redirects to Google OAuth when clicking Google button", () => {
    const mockLocation = { href: "" };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    const { getByText } = render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    getByText("Continue with Google").click();
    expect(window.location.href).toContain("/auth/google");
  });

  it("redirects to Facebook OAuth when clicking Facebook button", () => {
    const mockLocation = { href: "" };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    const { getByText } = render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    getByText("Continue with Facebook").click();
    expect(window.location.href).toContain("/auth/facebook");
  });
});
