import { Button, TextInput } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import React from "react";
import { Profile } from "../../../../../../api/src/controllers/profile.controller";
import useEditProfile from "../../hooks/use-edit-profile";
import useGetProfile from "../../hooks/use-get-profile";
import styles from "./styles.module.css";

const UserInfo = () => {
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
    initialValues: { fullName: "", email: "", whatsAppNumber: "" },

    validate: {
      fullName: hasLength({ min: 2, max: 30 }, "Full name must be 2-30 characters long"),
      email: isEmail("Invalid email"),
      whatsAppNumber: (value) =>
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
        className={styles.input}
        label="Full name"
        placeholder="Full name"
        key={form.key("fullName")}
        {...form.getInputProps("fullName")}
      />
      <TextInput
        className={styles.email}
        mt="sm"
        label="Email"
        placeholder="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />
      <TextInput
        className={styles.phone}
        mt="sm"
        label="Whatsapp Number"
        placeholder="ex. +4917642177411"
        key={form.key("whatsAppNumber")}
        {...form.getInputProps("whatsAppNumber")}
      />
      <Button className={styles.submitButton} type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};

export default UserInfo;
