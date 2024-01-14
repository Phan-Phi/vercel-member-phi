import { Box, Button, Modal, Stack, Typography, styled } from "@mui/material";

import { formatPhoneNumber } from "libs";

export default function RecoverPointPopup({ active, handleClose, data, submit }: any) {
  if (data == undefined) return null;
  const { owner_phone_number } = data;

  return (
    <ModalStyled
      open={active}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Wrapper>
        <Content id="modal-modal-title" variant="body1">
          Xác nhận thao tác thu hồi Điểm của số điện thoại{" "}
          {formatPhoneNumber(owner_phone_number)}
        </Content>

        <Note id="modal-modal-title" variant="body1">
          ( Thao tác này sẽ tạo thêm 1 xử lý điểm ở đầu trang thống kê)
        </Note>

        <Stack direction="row" justifyContent="center" spacing={2}>
          <Button onClick={() => submit()}>Xác nhận</Button>
          <Button color="error" onClick={() => handleClose()}>
            Hủy bỏ
          </Button>
        </Stack>
      </Wrapper>
    </ModalStyled>
  );
}

const ModalStyled = styled(Modal)(() => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const Wrapper = styled(Box)(() => {
  return {
    background: "white",
    textAlign: "center",
    padding: "2rem",
    borderRadius: "0.8rem",
  };
});

const Content = styled(Typography)(() => {
  return {
    marginBottom: "0.4rem",

    fontSize: "18px",
    fontWeight: 400,
  };
});
const Note = styled(Typography)(() => {
  return {
    marginBottom: "1rem",

    fontSize: "16px",
    fontWeight: 400,
  };
});
