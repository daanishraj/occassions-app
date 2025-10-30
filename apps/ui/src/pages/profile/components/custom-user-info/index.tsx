import { Button, TextInput } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { Profile } from "@occassions/types";
import React from "react";
import useEditProfile from "../../hooks/use-edit-profile";
import useGetProfile from "../../hooks/use-get-profile";
import styles from "./styles.module.css";

const CustomUserInfo = () => {
  
  const { data, isLoading, isError, error } = useGetProfile();
  const { editProfile } = useEditProfile();
  const isValidPhoneNumber = (number: string | undefined) => {
    if (!number) {
      return true;
    }
    const phoneNumberRegex = /^\+[1-9]\d{10,14}$/;
    return phoneNumberRegex.test(number);
  };

  const form = useForm<Profile>({
    mode: "controlled",
    validateInputOnChange: true,
    initialValues: { firstName: "", lastName: "", email: "", phoneNumber: "" },

    validate: {
      firstName: hasLength({ min: 1, max: 50 }, "First name must be 1-50 characters long"),
      lastName: hasLength({ min: 1, max: 50 }, "Last name must be 1-50 characters long"),
      email: isEmail("Invalid email"),
      phoneNumber: (value: string | undefined) =>
        isValidPhoneNumber(value)
          ? null
          : "Number must begin with a +, have the country code, and the correct number of digits",
    },
  });
  React.useEffect(() => {
    if (data) {
      form.initialize(data);
      form.setValues(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect (() => {
    console.log ('render UserInfo - profile page component')

  })

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    editProfile(form.getValues());
  };

  if (isError) {
    return (
      <div>
        <span>There was an error fetching the profile data</span>
        <span>{error?.message}</span>
      </div>
    );
  }

  if (isLoading) {
    return <div>Fetching data..</div>;
  }

  return (
    <form className={styles.form} onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="First name"
        placeholder="First name"
        key={form.key("firstName")}
        {...form.getInputProps("firstName")}
        withAsterisk
      />
      <TextInput
        mt="sm"
        label="Last name"
        placeholder="Last name"
        key={form.key("lastName")}
        {...form.getInputProps("lastName")}
        withAsterisk
      />
      <TextInput
        mt="sm"
        label="Email"
        placeholder="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
        withAsterisk
      />
      <TextInput
        mt="sm"
        label="Phone Number"
        placeholder="ex. +4917642177411"
        key={form.key("phoneNumber")}
        {...form.getInputProps("phoneNumber")}
      />
      <Button className={styles.submitButton} type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};

export default CustomUserInfo;
