import "@testing-library/jest-dom";

// mock لـ Radix Switch (PreferencesCard)
jest.mock("@radix-ui/react-switch", () => {
  return {
    __esModule: true,
    Root: ({ children, ...props }) => <div {...props}>{children}</div>,
    Thumb: (props) => <div {...props} />
  };
});
