import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Form from './Form';
import Loader from './Loader';
import renderer from 'react-test-renderer';


beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(() =>

    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
});

afterEach(() => {
   jest.restoreAllMocks();
});

test("When I type into the name input, it updates the value correctly.", () => {
   render(<Form />);
  const input = screen.getByPlaceholderText("Enter your name");

  fireEvent.change(input, { target: { value: 'a' } });
  expect(input.value).toBe("a");
});

test("When I type into the email input, it updates the value correctly.", () => {
   render(<Form />);
  const email = screen.getByPlaceholderText("Enter your Email");

  fireEvent.change(email, { target: { value: 'pvs@gmail.com' } });
  expect(email.value).toBe("pvs@gmail.com");
});

test("Password input field should mask the text as the user types.", () => {
  render(<Form />);
  const password = screen.getByPlaceholderText("Enter your password");

   expect(password).toHaveAttribute("type", "password");
   
  fireEvent.change(password, { target: { value: 'pass@123' } });
  expect(password.value).toBe("pass@123");
});

test("The submit button should be disabled if the form is incomplete.", () => {
  render(<Form />);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  expect(submitButton).toBeDisabled();
});

test("Submit button should trigger form submission when clicked with valid inputs.", async () => {
  render(<Form />);

  fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: 'Demo' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your Email"), { target: { value: 'demo@gmail.com' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: '12345678' } });

  const submitButton = screen.getByRole('button', { name: /submit/i });
  expect(submitButton).not.toBeDisabled();

  fireEvent.click(submitButton);


  expect(screen.getByTestId('loader')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/success/i);
  });
});


test('While the form is being submitted, a loading spinner should appear', async () => {
  render(<Form />);

  fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: 'Demo' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your Email"), { target: { value: 'demo@gmail.com' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: '12345678' } });

  fireEvent.click(screen.getByRole('button'));


  expect(screen.getByTestId('loader')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByRole('button')).toHaveTextContent('Submit');
  });
});

test('When the form is successfully submitted, a success message should appear.', async () => {
  render(<Form />);

  fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: 'Demo' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your Email"), { target: { value: 'demo@gmail.com' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: '12345678' } });

  fireEvent.click(screen.getByRole('button'));

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/success/i);
  });
});

test("If the form submission fails, an error message should be displayed.", async () => {

  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    })
  );

  render(<Form />);

  fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: 'demo' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your Email"), { target: { value: 'demo@gmail.com' } });
  fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: '123456' } });

   fireEvent.click(screen.getByRole('button'));

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/failed to submit form/i);
  });
});




test("The form component should match the snapshot.", () => {
  const tree = renderer.create(<Form />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("The loader component should match the snapshot.", () => {
  const tree = renderer.create(<Loader />).toJSON();
   expect(tree).toMatchSnapshot();
});
