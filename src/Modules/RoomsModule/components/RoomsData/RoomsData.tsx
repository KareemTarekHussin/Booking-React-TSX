import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Button,
  Box,
  Checkbox,
  ListItemText,
  Alert
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SubmitHandler, useForm } from "react-hook-form";
import { Inputs } from "../../../../interfaces/interface";
import { userRequest } from "../../../../utils/request";
import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../../../../utils/error";
import { useToast } from "../../../Context/ToastContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function RoomsData() {

  const [facilitiesList, setFacilitiesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const location = useLocation();
  const roomId = location.pathname.split("/")[3];
  const roomData = location.state?.roomData;
  const state = location.state?.state;
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const getFacilitiesList = async () => {
    setSpinner(true);
    try {
      const response = await userRequest.get(`/admin/room-facilities`);
      setFacilitiesList(response.data.data.facilities);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };

  const appendToFormData = (data: Inputs) => {
    const formData = new FormData();
    formData.append("roomNumber", data?.roomNumber);
    formData.append("price", data?.price);
    formData.append("capacity", data?.capacity);
    formData.append("discount", data?.discount);
    if (Array.isArray(data.facilities)) {
      data.facilities.map((facility: string) =>
        formData.append("facilities[]", facility)
      );
    }

    for (let i = 0; i < data.imgs.length; i++) {
      formData.append("imgs", data.imgs[i]);
    }

    return formData;
  };

  // console.log(Array.from(watch("imgs")));

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const addFormData = appendToFormData(data);

    try {
      const res = await userRequest({
        method: state === "edit" ? "put" : "post",
        url: state === "edit" ? `/admin/rooms/${roomId}` : `/admin/rooms`,
        data: addFormData,
      });
      showToast("success", res.data.message);
      setLoading(false);

      navigate("/dashboard/rooms");
    } catch (error) {
      setLoading(false);
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };

  useEffect(() => {
    getFacilitiesList();

    if (state === "edit" && roomData) {
      setValue("roomNumber", roomData.roomNumber);
      setValue("price", roomData.price);
      setValue("capacity", roomData.capacity);
      setValue("discount", roomData.discount);
      setValue(
        "facilities",
        roomData.facilities.map((item: { _id: string }) => item?._id)
      );
      // console.log(roomData.images);
      for (let i = 0; i < roomData.images.length; i++) {
        setValue("imgs", [...roomData.images[i]]);
      }
    }
    // getUrl()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [roomData, setValue]);

  return (
    <Container sx={{marginTop:8}}>
      <Box 
        component="form" onSubmit={handleSubmit(onSubmit)} 
        sx={{ display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Grid lg={9} container sx={{display:'flex',flexDirection:'column',gap:3}}>



          <Grid item md={12}>
            <TextField
              size="small"
              label="Room Number"
              variant="filled"
              {...register("roomNumber", {
                required: "Room Number is required",
              })}
              fullWidth
            />
            {errors.roomNumber && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.roomNumber.message}
              </Alert>
            )}
          </Grid>

          
          <Grid item sm={12}  sx={{display:'flex', gap:2,backgroundColor:'gol'}}>
            <Grid item sm={12}>
              <TextField
              size="small"
                label="Price"
                variant="filled"
                {...register("price", {
                  required: "Price is required",
                })}
                defaultValue={roomData?.price}
                fullWidth
              />
              {errors.price && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.price.message}
                </Alert>
              )}
            </Grid>

            <Grid item sm={12}>
              <TextField
              size="small"
                label="Capacity"
                variant="filled"
                {...register("capacity", {
                  required: "capacity is required",
                })}
                defaultValue={roomData?.capacity}
                fullWidth
              />
              {errors.capacity && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.capacity.message}
                </Alert>
              )}
            </Grid>
          </Grid>
          
          <Grid item sm={12}  sx={{display:'flex',flexDirection:{xs:'column',sm:'row'}, gap:2}}>
            <Grid item sm={12}>
              <TextField
              size="small"
                label="Discount"
                variant="filled"
                {...register("discount", {
                  required: "discount is required",
                })}
                defaultValue={roomData?.discount}
                fullWidth
              />
              {errors.discount && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.discount.message}
                </Alert>
              )}
            </Grid>
            <Grid item sm={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel id="demo-multiple-checkbox-label">Facilities</InputLabel>
                <Select
                  size="small"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={watch("facilities") || []}
                  {...register("facilities", {
                    required: "facilities is required",
                  })}
                  label="Facilities"
                  renderValue={(selected) => (
                    <div>
                      {selected.map((id) => (
                        <span style={{ margin: "8px" }} key={id}>
                          {spinner ? "Loading..." : facility && facility?.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              >
                {facilitiesList.map((item: FacilitiesProps) => (
                  <MenuItem key={item._id} value={item?._id}>
                    <Checkbox
                      checked={watch("facilities")?.includes(item._id)}
                    />

                    <ListItemText primary={item?.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.facilities && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.facilities.message}
              </Alert>
            )}
          </Grid>
          <Grid item md={3}>
            <label htmlFor="imgs">
              <Button
                size="large"
                component="span"
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{width:'100%',paddingBlock:{lg:1.5}}}
              >
                Upload Images
              </Button>
            </label>

            <input
              type="file"
              id="imgs"
              style={{ display: "none" }}
              multiple
              {...register("imgs", {
                required: "imgs is required",
              })}
            />
            {errors.imgs && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.imgs.message}
              </Alert>
            )}
          </Grid>


        <Box sx={{mt: 2,alignSelf:'end' }}>
          <Button variant="outlined" size="large"  sx={{ mr: 3 }}>
            Cancle
          </Button>
          <Button variant="contained" size="large" type="submit">
            Save
          </Button>
        </Box>
          
        </Grid>
        <Grid container mt={2} spacing={1}>
          {watch("imgs") && Array.from(watch("imgs")).map((img ,index) => (
            <Grid item md={2} key={index}>
              <img src={img?URL.createObjectURL(img): ""} style={{width:"100%"}} alt="" />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Link to={"/dashboard/rooms"}>
            <Button variant="outlined" sx={{ mr: 4 }}>
              Cancle
            </Button>
          </Link>
          <Button disabled={loading} variant="contained" type="submit">
            {loading ? <CircularProgress color="primary" size={24} /> : "Save"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
