import useSWR from "swr";
import { useRouter } from "next/router";
import { get, isEmpty, set } from "lodash";
import { useMountedState } from "react-use";
import { getSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, Skeleton, Stack, Typography, styled } from "@mui/material";

import {
  Loading,
  Container,
  BoxWithShadow,
  FormControlV2,
  LoadingButton,
  CheckboxSingleChoice,
} from "components";
import axios from "axios.config";
import { BUTTON } from "constant";
import { VERSION, VERSION_RELEASED_NOTES } from "apis";
import { useNotification, usePermission } from "hooks";
import { transformJSONToFormData, transformUrl } from "libs";
import {
  VERSION_ITEM,
  VersionSchemaProps,
  defaultVersionFormState,
} from "yups/Setting/Version";

export default function DetailVersion() {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<VersionSchemaProps>();

  const { data, mutate } = useSWR<VERSION_ITEM>(
    transformUrl(VERSION, {
      filter: `(id="${router.query.id}")`,
    })
  );

  const setDefaultValuesHandler = useCallback(
    (data: VERSION_ITEM) => {
      const body = {} as VersionSchemaProps;

      const keyList = [...Object.keys(defaultVersionFormState()), "self"];

      keyList.forEach((key) => {
        const temp = get(data, key);

        set(body, key, temp);
      });

      setDefaultValues(body);
    },

    []
  );

  useEffect(() => {
    if (data == undefined) return;

    setDefaultValuesHandler(data.items[0]);
  }, [data]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const data = await mutate();

    data && setDefaultValuesHandler(data);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
}

interface RootComponentProps {
  defaultValues: VersionSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, onSuccessHandler } = props;

  const router = useRouter();
  const isMounted = useMountedState();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { hasPermission } = usePermission("write_version");

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: defaultValues,
  });

  const { data: dataReleasedNotes, mutate } = useSWR<any>(
    transformUrl(VERSION_RELEASED_NOTES, {
      filter: `(versionTrack="${router.query.id}"&&locale="vi")`,
    })
  );

  const onSubmit = useCallback(
    async ({ data, dirtyFields }: { data: VersionSchemaProps; dirtyFields: object }) => {
      try {
        setLoading(true);
        const session = await getSession();

        if (!isEmpty(dirtyFields)) {
          const formData = transformJSONToFormData(data, dirtyFields);

          let token = "";
          if (session) {
            const { user } = session;
            token = user.token;
          }

          await axios.patch(
            `${process.env.NEXT_PUBLIC_CHECK_VERSION_URL}${VERSION}${router.query.id}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          enqueueSnackbarWithSuccess("Cập nhật version thành công");
          onSuccessHandler();
          router.back();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const onSetIsUpdateModeHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      setIsUpdateMode(isUpdateMode);
    };
  }, []);

  const onGoBackHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      if (isUpdateMode) {
        reset(defaultValues, {
          keepDirty: false,
        });

        setIsUpdateMode(false);
      } else {
        router.back();
      }
    };
  }, []);

  const renderDescription = useMemo(() => {
    // if (dataReleasedNotes == undefined) {
    //   return <Skeleton height={400} />;
    // }
    if (dataReleasedNotes == undefined || dataReleasedNotes.items.length === 0)
      return <BoxShadow />;

    const _data = dataReleasedNotes.items[0].text.replace(/\n/g, "<br>");
    const replaceStrings = _data.split("<br>");

    return (
      <Fragment>
        <BoxShadow>
          <WrapperDescription component="ul">
            {replaceStrings.map((el: string, idx: number) => {
              return (
                <Box component="li" key={idx} sx={{ paddingTop: idx !== 0 ? 1 : 0 }}>
                  {el.replace("\r", "")}
                </Box>
              );
            })}
          </WrapperDescription>
        </BoxShadow>
      </Fragment>
    );
  }, [dataReleasedNotes]);

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container spacing={2} marginBottom={3}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Bản Cập Nhật {defaultValues.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Phiên Bản"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="appName"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tên Ứng Dụng"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="appPlatform"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Hệ Điều Hành"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="deprecated"
                render={(props) => {
                  return (
                    <CheckboxSingleChoice
                      controlState={props}
                      label="Trạng Thái"
                      CheckboxProps={{
                        disabled: isUpdateMode ? false : true,
                      }}
                      checkboxLabel={props.field.value ? "Bắt buộc" : "Không bắt buộc"}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {renderDescription}
            </Grid>
          </Grid>
        </BoxWithShadow>

        <Stack flexDirection="row" columnGap={2} justifyContent="center">
          <Button
            variant="outlined"
            // disabled={loading}
            onClick={onGoBackHandler(isUpdateMode)}
          >
            {BUTTON.BACK}
          </Button>

          {hasPermission && (
            <LoadingButton
              onClick={() => {
                if (isUpdateMode) {
                  handleSubmit((data) => {
                    onSubmit({
                      data,
                      dirtyFields,
                    });
                  })();
                } else {
                  setIsUpdateMode(true);
                }
              }}
              loading={loading}
            >
              {isUpdateMode ? BUTTON.EDIT : BUTTON.UPDATE}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

const WrapperDescription = styled(Box)(() => {
  return {
    paddingLeft: "1rem",
    margin: 0,
  };
});

const BoxShadow = styled(BoxWithShadow)(() => {
  return {
    overflowY: "scroll",
    height: "15rem",
    backgroundColor: "#bdbdbd",
  };
});
