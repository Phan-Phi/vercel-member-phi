// import useSWR from "swr";
// import { useRouter } from "next/router";
// import { Controller, useForm } from "react-hook-form";
// import { useMountedState } from "react-use";
// import React, { useCallback, useEffect, useMemo, useState } from "react";

// import { Container, Grid, styled, Button, Box, Stack, Typography } from "@mui/material";

// import { isEmpty, get, set, cloneDeepWith, cloneDeep } from "lodash";

// import axios from "axios.config";
// import { BUTTON, INPUT_PROPS } from "constant";
// import { PATHNAME } from "routes";
// import { useNotification } from "hooks";
// import { responseSchema, SETTINGS_ITEM, SOCIAL_ICON_ITEM } from "interfaces";
// import { SETTINGS, SOCIAL_ICONS } from "apis";
// import {
//   notificationSettingSchema,
//   NotificationSettingSchemaProps,
//   socialIconSchema,
//   SocialIconSchemaProps,
//   defaultNotificationSettingFormState,
//   SocialIconProps,
// } from "yups";

// import {
//   Loading,
//   FormControl,
//   BoxWithShadow,
//   LoadingButton,
//   FormControlForNumber,
//   FormControlForPhoneNumber,
//   FormControlV2,
//   FormControlForNumberV2,
//   FormControlForPhoneNumberV2,
// } from "components";
// import { transformUrl } from "libs";

// import SocialIconForm from "./SocialIconForm";

// const POINT_NOTIFICATION_TEMPLATE = [
//   "{{transaction_type_display}}: Loại giao dịch",
//   "{{target_name}}: Tên đối tượng",
//   "{{transaction_amount}}: Điểm giao dịch",
// ];

// const BELOW_THRESHOLD_TEMPLATE = ["{{balance}}: Điểm"];

// export default function ConfigNotificationUpdate() {
//   const router = useRouter();

//   const [defaultValues, setDefaultValues] = useState<NotificationSettingSchemaProps>();

//   const [defaultSocialIconValues, setDefaultSocialIconValues] =
//     useState<SocialIconSchemaProps>();

//   const { data: resSettingData, mutate: settingMutate } = useSWR<SETTINGS_ITEM>(
//     transformUrl(SETTINGS, {
//       use_cache: false,
//     })
//   );

//   const { data: resSocialIconData, mutate: socialIconMutate } = useSWR<
//     responseSchema<SOCIAL_ICON_ITEM>
//   >(
//     transformUrl(SOCIAL_ICONS, {
//       get_all: true,
//     })
//   );

//   const setDefaultValuesHandler = useCallback((data: SETTINGS_ITEM) => {
//     const body = {} as NotificationSettingSchemaProps;

//     const keyList = Object.keys(defaultNotificationSettingFormState());

//     keyList.forEach((key) => {
//       let temp = get(data, key);

//       if (key === "store_notification_period") {
//         temp = temp / (60 * 60 * 24);
//       }

//       set(body, key, temp);
//     });

//     setDefaultValues(body);
//   }, []);

//   const setDefaultSocialIconValuesHandler = useCallback(
//     (data: responseSchema<SOCIAL_ICON_ITEM>) => {
//       const body = {} as SocialIconSchemaProps;

//       const socialItemList: SocialIconProps[] = [];

//       data.results.forEach((el) => {
//         const { image, link, self } = el;

//         socialItemList.push({
//           self,
//           link,
//           image: [{ file: image }],
//         });
//       });

//       set(body, "socialItemList", socialItemList);

//       setDefaultSocialIconValues(body);
//     },
//     []
//   );

//   useEffect(() => {
//     if (resSettingData == undefined) return;

//     setDefaultValuesHandler(resSettingData);
//   }, [resSettingData]);

//   useEffect(() => {
//     if (resSocialIconData == undefined) return;

//     setDefaultSocialIconValuesHandler(resSocialIconData);
//   }, [resSocialIconData]);

//   const onSuccessHandler = useCallback(async () => {
//     await Promise.all([settingMutate(), socialIconMutate()]);
//     router.back();
//   }, []);

//   if (defaultValues == undefined || defaultSocialIconValues == undefined) {
//     return <Loading />;
//   }

//   return (
//     <RootComponent {...{ defaultValues, onSuccessHandler, defaultSocialIconValues }} />
//   );
// }

// interface RootComponentProps {
//   defaultValues: NotificationSettingSchemaProps;
//   defaultSocialIconValues: SocialIconSchemaProps;
//   onSuccessHandler: () => Promise<void>;
// }

// const RootComponent = (props: RootComponentProps) => {
//   const { defaultValues, onSuccessHandler, defaultSocialIconValues } = props;

//   const router = useRouter();
//   const isMounted = useMountedState();

//   const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
//     useNotification();

//   const {
//     handleSubmit,
//     control,
//     formState: { dirtyFields },
//   } = useForm({
//     resolver: notificationSettingSchema(),
//     defaultValues,
//   });

//   const {
//     handleSubmit: socialIconHandleSubmit,
//     control: socialIconControl,
//     clearErrors: socialIconClearErrors,
//     setError: socialIconSetError,
//   } = useForm({
//     resolver: socialIconSchema(),
//     defaultValues: defaultSocialIconValues,
//   });

//   const onSubmit = useCallback(
//     async ({
//       data,
//       socialIconData,
//       dirtyFields,
//       defaultSocialIconData,
//     }: {
//       data: NotificationSettingSchemaProps;
//       socialIconData: SocialIconSchemaProps;
//       dirtyFields: object;
//       defaultSocialIconData: SocialIconSchemaProps;
//     }) => {
//       // store_notification_period

//       const transformedData = cloneDeep(data);
//       const storeNotificationPeriod = get(transformedData, "store_notification_period");

//       set(
//         transformedData,
//         "store_notification_period",
//         parseInt(storeNotificationPeriod) * (60 * 60 * 24)
//       );

//       const currentSocialIconData = socialIconData.socialItemList.map((el) => {
//         const { image, link } = el;

//         return {
//           link,
//           image: image[0].file,
//         };
//       });

//       const originalSocialIconData = defaultSocialIconData.socialItemList.map((el) => {
//         const { image, link, self } = el;

//         return {
//           link,
//           image: image[0].file,
//           self,
//         };
//       });

//       const socialIconCreateList: {
//         link: string;
//         image: File;
//       }[] = [];
//       const socialIconDeleteList: any[] = [];

//       currentSocialIconData.forEach((el) => {
//         const { image, link } = el;

//         if (image instanceof File) {
//           socialIconCreateList.push({
//             image,
//             link,
//           });
//         }
//       });

//       originalSocialIconData.forEach((el) => {
//         const value = el.image;

//         const hasImage = currentSocialIconData.some((el) => {
//           return el.image === value;
//         });

//         if (!hasImage) {
//           socialIconDeleteList.push(el);
//         }
//       });

//       try {
//         setLoading(true);

//         if (!isEmpty(dirtyFields)) {
//           await axios.patch(SETTINGS, transformedData);
//         }

//         if (!isEmpty(socialIconDeleteList)) {
//           await Promise.all(
//             socialIconDeleteList.map((el) => {
//               return axios.delete(el.self);
//             })
//           );
//         }

//         if (!isEmpty(socialIconCreateList)) {
//           await Promise.all(
//             socialIconCreateList.map((el) => {
//               const { link, image } = el;

//               const formData = new FormData();
//               formData.append("link", link);
//               formData.append("image", image);
//               return axios.post(SOCIAL_ICONS, formData);
//             })
//           );
//         }

//         enqueueSnackbarWithSuccess("Cập nhật thông báo thành công");
//         onSuccessHandler();
//       } catch (err) {
//         enqueueSnackbarWithError(err);
//       } finally {
//         if (isMounted()) {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   const onGoBackHandler = useCallback(() => {
//     router.push(`/${PATHNAME.CAI_DAT}/${PATHNAME.CAU_HINH}`);
//   }, []);

//   const renderIncreasePointTemplate = useMemo(() => {
//     return (
//       // <FormControl
//       //   label="Nội dung thông báo tích điểm"
//       //   placeholder="Nội dung thông báo tích điểm"
//       //   control={control}
//       //   name="increase_point_notification_template"
//       //   FormHelperTextProps={{
//       //     children: POINT_NOTIFICATION_TEMPLATE.map((el) => {
//       //       return (
//       //         <Typography key={el} component="span" display="block" marginBottom={1}>
//       //           {el}
//       //         </Typography>
//       //       );
//       //     }),
//       //     sx: {
//       //       marginTop: 2,
//       //     },
//       //   }}
//       // />

//       <Controller
//         name="increase_point_notification_template"
//         control={control}
//         render={(props) => {
//           return (
//             <FormControlV2
//               controlState={props}
//               label="Nội dung thông báo tích điểm"
//               placeholder="Nội dung thông báo tích điểm"
//               FormHelperTextProps={{
//                 children: POINT_NOTIFICATION_TEMPLATE.map((el) => {
//                   return (
//                     <Typography
//                       key={el}
//                       component="span"
//                       display="block"
//                       marginBottom={1}
//                     >
//                       {el}
//                     </Typography>
//                   );
//                 }),
//                 sx: {
//                   marginTop: 2,
//                 },
//               }}
//             />
//           );
//         }}
//       />
//     );
//   }, []);

//   const renderDecreasePointTemplate = useMemo(() => {
//     return (
//       // <FormControl
//       //   label="Nội dung thông báo trừ điểm"
//       //   placeholder="Nội dung thông báo trừ điểm"
//       //   control={control}
//       //   name="decrease_point_notification_template"
//       //   FormHelperTextProps={{
//       //     children: POINT_NOTIFICATION_TEMPLATE.map((el) => {
//       //       return (
//       //         <Typography key={el} component="span" display="block" marginBottom={1}>
//       //           {el}
//       //         </Typography>
//       //       );
//       //     }),
//       //     sx: {
//       //       marginTop: 2,
//       //     },
//       //   }}
//       // />

//       <Controller
//         name="decrease_point_notification_template"
//         control={control}
//         render={(props) => {
//           return (
//             <FormControlV2
//               controlState={props}
//               label="Nội dung thông báo trừ điểm"
//               placeholder="Nội dung thông báo trừ điểm"
//               FormHelperTextProps={{
//                 children: POINT_NOTIFICATION_TEMPLATE.map((el) => {
//                   return (
//                     <Typography
//                       key={el}
//                       component="span"
//                       display="block"
//                       marginBottom={1}
//                     >
//                       {el}
//                     </Typography>
//                   );
//                 }),
//                 sx: {
//                   marginTop: 2,
//                 },
//               }}
//             />
//           );
//         }}
//       />
//     );
//   }, []);

//   const renderBelowThresholdTemplate = useMemo(() => {
//     return (
//       // <FormControl
//       //   label="Nội dung thông báo điểm thấp"
//       //   placeholder="Nội dung thông báo điểm thấp"
//       //   control={control}
//       //   name="below_threshold_notification_template"
//       //   FormHelperTextProps={{
//       //     children: BELOW_THRESHOLD_TEMPLATE.map((el) => {
//       //       return (
//       //         <Typography key={el} component="span" display="block" marginBottom={1}>
//       //           {el}
//       //         </Typography>
//       //       );
//       //     }),
//       //     sx: {
//       //       marginTop: 2,
//       //     },
//       //   }}
//       // />

//       <Controller
//         name="below_threshold_notification_template"
//         control={control}
//         render={(props) => {
//           return (
//             <FormControlV2
//               controlState={props}
//               label="Nội dung thông báo điểm thấp"
//               placeholder="Nội dung thông báo điểm thấp"
//               FormHelperTextProps={{
//                 children: BELOW_THRESHOLD_TEMPLATE.map((el) => {
//                   return (
//                     <Typography
//                       key={el}
//                       component="span"
//                       display="block"
//                       marginBottom={1}
//                     >
//                       {el}
//                     </Typography>
//                   );
//                 }),
//                 sx: {
//                   marginTop: 2,
//                 },
//               }}
//             />
//           );
//         }}
//       />
//     );
//   }, []);

//   return (
//     <Container>
//       <Stack spacing={3}>
//         <BoxWithShadow>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="h2" color="primary2.main">
//                 Tần Suất
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               {/* <FormControlForNumber
//                 InputProps={{
//                   endAdornment: (
//                     <StyledEndAdornment>
//                       <Typography>ngày</Typography>
//                     </StyledEndAdornment>
//                   ),
//                 }}
//                 label="Chu kỳ gửi thông báo:"
//                 placeholder="Nhập số ngày.."
//                 NumberFormatProps={{
//                   thousandSeparator: false,
//                 }}
//                 control={control}
//                 name="store_notification_period"
//               /> */}

//               <Controller
//                 control={control}
//                 name="store_notification_period"
//                 render={(props) => {
//                   return (
//                     <FormControlForNumberV2
//                       InputProps={{
//                         endAdornment: (
//                           <StyledEndAdornment>
//                             <Typography>ngày</Typography>
//                           </StyledEndAdornment>
//                         ),
//                       }}
//                       label="Chu kỳ gửi thông báo:"
//                       placeholder="Nhập số ngày.."
//                       controlState={props}
//                       NumberFormatProps={{
//                         thousandSeparator: false,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={6}></Grid>

//             <Grid item xs={6}>
//               {/* <FormControlForNumber
//                 InputProps={{
//                   endAdornment: (
//                     <StyledEndAdornment>
//                       <Typography>lượt</Typography>
//                     </StyledEndAdornment>
//                   ),
//                 }}
//                 label="Số lượt mỗi chu kỳ:"
//                 placeholder="Nhập số lượt..."
//                 NumberFormatProps={{
//                   thousandSeparator: false,
//                 }}
//                 control={control}
//                 name="store_notification_quantity_in_period"
//               /> */}

//               <Controller
//                 control={control}
//                 name="store_notification_quantity_in_period"
//                 render={(props) => {
//                   return (
//                     <FormControlForNumberV2
//                       InputProps={{
//                         endAdornment: (
//                           <StyledEndAdornment>
//                             <Typography>lượt</Typography>
//                           </StyledEndAdornment>
//                         ),
//                       }}
//                       label="Số lượt mỗi chu kỳ:"
//                       placeholder="Nhập số lượt..."
//                       controlState={props}
//                       NumberFormatProps={{
//                         thousandSeparator: false,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </BoxWithShadow>

//         <BoxWithShadow>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="h2" color="primary2.main">
//                 Nội dung từ hệ thống thông báo
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               {/* <FormControl
//                 label="Tiêu đề thông báo tích điểm"
//                 placeholder="Tiêu đề thông báo tích điểm"
//                 control={control}
//                 name="increase_point_notification_title"
//               /> */}

//               <Controller
//                 name="increase_point_notification_title"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       placeholder="Tiêu đề thông báo tích điểm"
//                       label="Tiêu đề thông báo tích điểm"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               {renderIncreasePointTemplate}
//             </Grid>

//             <Grid item xs={12}>
//               {/* <FormControl
//                 label="Tiêu đề thông báo trừ điểm"
//                 placeholder="Tiêu đề thông báo trừ điểm"
//                 control={control}
//                 name="decrease_point_notification_title"
//               /> */}

//               <Controller
//                 name="decrease_point_notification_title"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề thông báo trừ điểm"
//                       placeholder="Tiêu đề thông báo trừ điểm"
//                     />
//                   );
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               {renderDecreasePointTemplate}
//             </Grid>

//             <Grid item xs={12}>
//               {/* <FormControl
//                 label="Tiêu đề thông báo điểm thấp"
//                 placeholder="Tiêu đề thông báo điểm thấp"
//                 control={control}
//                 name="below_threshold_notification_title"
//               /> */}

//               <Controller
//                 name="below_threshold_notification_title"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề thông báo điểm thấp"
//                       placeholder="Tiêu đề thông báo điểm thấp"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               {renderBelowThresholdTemplate}
//             </Grid>
//           </Grid>
//         </BoxWithShadow>

//         <BoxWithShadow>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="h2" color="primary2.main">
//                 Email Template
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               {/* <Controller
//                 control={control}
//                 name="email_sender"
//                 render={(props) => {
//                   return (
//                     <FormControlForPhoneNumberV2 controlState={props} label="Hotline" />
//                   );
//                 }}
//               /> */}
//               {/* <FormControlForPhoneNumber
//                 placeholder="Hotline"
//                 label="Hotline"
//                 control={control}
//                 name="hotline"
//               /> */}

//               <Controller
//                 name="email_sender_name"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tên người gửi email"
//                       placeholder="Tên người gửi email"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               {/* <FormControl
//                 label="Email"
//                 placeholder="Email"
//                 control={control}
//                 name="contact_email"
//                 InputProps={{
//                   type: "email",
//                 }}
//               /> */}

//               <Controller
//                 name="email_sender"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Người gửi"
//                       placeholder="Người gửi"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               {/* <SocialIconForm
//                 {...{
//                   control: socialIconControl,
//                   clearErrors: socialIconClearErrors,
//                   setError: socialIconSetError,
//                 }}
//               /> */}

//               <Controller
//                 name="admin_create_password_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề thiết lập mật khẩu tài khoản nhân viên"
//                       placeholder="Tiêu đề thiết lập mật khẩu tài khoản nhân viên"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="admin_create_password_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Thiết lập mật khẩu tài khoản nhân viên"
//                       placeholder="Thiết lập mật khẩu tài khoản nhân viên"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="admin_reset_password_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề đặt lại mật khẩu tài khoản nhân viên"
//                       placeholder="Tiêu đề đặt lại mật khẩu tài khoản nhân viên"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="admin_reset_password_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Đặt lại mật khẩu tài khoản nhân viên"
//                       placeholder="Đặt lại mật khẩu tài khoản nhân viên"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="cashier_create_password_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề thiết lập mật khẩu tài khoản nhân viên đối tác"
//                       placeholder="Tiêu đề thiết lập mật khẩu tài khoản nhân viên đối tác"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="cashier_create_password_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Thiết lập mật khẩu tài khoản nhân viên đối tác"
//                       placeholder="Thiết lập mật khẩu tài khoản nhân viên đối tác"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="merchant_create_password_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề thiết lập mật khẩu tài khoản đối tác"
//                       placeholder="Tiêu đề thiết lập mật khẩu tài khoản đối tác"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="merchant_create_password_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Thiết lập mật khẩu tài khoản đối tác"
//                       placeholder="Thiết lập mật khẩu tài khoản đối tác"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="merchant_or_cashier_reset_password_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
//                       placeholder="Tiêu đề thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="merchant_or_cashier_reset_password_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
//                       placeholder="Thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="merchant_wallet_below_threshold_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề thông báo tài khoản đối tác thấp điểm"
//                       placeholder="Tiêu đề thông báo tài khoản đối tác thấp điểm"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="merchant_wallet_below_threshold_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Thông báo tài khoản đối tác thấp điểm"
//                       placeholder="Thông báo tài khoản đối tác thấp điểm"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="customer_verify_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề xác thực email khách hàng"
//                       placeholder="Tiêu đề xác thực email khách hàng"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="customer_verify_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Xác thực email khách hàng"
//                       placeholder="Xác thực email khách hàng"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="customer_reset_password_email_subject"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Tiêu đề đặt lại mật khẩu tài khoản khách hàng"
//                       placeholder="Tiêu đề đặt lại mật khẩu tài khoản khách hàng"
//                     />
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="customer_reset_password_email_template"
//                 control={control}
//                 render={(props) => {
//                   return (
//                     <FormControlV2
//                       controlState={props}
//                       label="Đặt lại mật khẩu tài khoản khách hàng"
//                       placeholder="Đặt lại mật khẩu tài khoản khách hàng"
//                       InputProps={{
//                         ...INPUT_PROPS,
//                       }}
//                     />
//                   );
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </BoxWithShadow>

//         <Stack flexDirection="row" columnGap={2} justifyContent="center">
//           <Button variant="outlined" disabled={loading} onClick={onGoBackHandler}>
//             {BUTTON.BACK}
//           </Button>

//           <LoadingButton
//             onClick={handleSubmit((data) => {
//               socialIconHandleSubmit((socialIconData) => {
//                 onSubmit({
//                   data,
//                   socialIconData,
//                   dirtyFields,
//                   defaultSocialIconData: defaultSocialIconValues,
//                 });
//               })();
//             })}
//             loading={loading}
//           >
//             {BUTTON.UPDATE}
//           </LoadingButton>
//         </Stack>
//       </Stack>
//     </Container>
//   );
// };

// const StyledEndAdornment = styled(Box)(({ theme }) => {
//   return {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#E6E6E6",
//     width: "65px !important",
//     height: "2.5rem",
//   };
// });
export {};
