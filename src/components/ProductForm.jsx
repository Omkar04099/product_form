import { useState, useCallback, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";


const stateCityData = {
  California: ["Los Angeles", "San Francisco", "San Diego"],
  Texas: ["Houston", "Dallas", "Austin"],
  Florida: ["Miami", "Orlando", "Tampa"],
  NewYork: ["New York City", "Buffalo", "Albany"],
};

const schema = yup.object().shape({
  productName: yup.string().min(3).required("Product Name is required"),
  productDescription: yup.string().min(10).required("Description is required"),
  productImage: yup
    .mixed()
    .test("required", "Image is required", (value) => value && value.length > 0)
    .test(
      "fileSize",
      "File size too large (max 2MB)",
      (value) => value && value[0]?.size <= 2097152
    )
    .test(
      "fileType",
      "Only JPG/PNG allowed",
      (value) => value && ["image/jpeg", "image/png"].includes(value[0]?.type)
    ),
  productPrice: yup.number().positive().required("Price is required"),
  states: yup.array().min(1, "Select at least one state"),
  cities: yup.array().min(1, "Select at least one city"),
});


const ProductForm = () => {
  const [selectedStates, setSelectedStates] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
      setValue("productImage", e.target.files);
    };
  
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const selectedStateNames = watch("states")?.map((s) => s.value) || [];
  const availableCities = useMemo(() => {
    return selectedStateNames.flatMap((state) => stateCityData[state] || []);
  }, [selectedStateNames]);

  const onSubmit = useCallback(
    (data) => {
      console.log("Form Data:", data);
      reset();
    },
    [reset]
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-6 
  fade-in"
    >
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl">
        <h2 className="form-heading">Product Form</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Product Name
            </label>
            <input
              {...register("productName")}
              className="w-full p-2 border rounded"
            />
            <p className="text-red-500 text-sm">
              {errors.productName?.message}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Product Description
            </label>
            <textarea
              {...register("productDescription")}
              className="w-full p-2 border rounded"
            />
            <p className="text-red-500 text-sm">
              {errors.productDescription?.message}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Product Image
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="w-full p-2 border rounded"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <p className="text-red-500 text-sm">
              {errors.productImage?.message}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Product Price
            </label>
            <input
              type="number"
              {...register("productPrice")}
              className="w-full p-2 border rounded"
            />
            <p className="text-red-500 text-sm">
              {errors.productPrice?.message}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Select States
            </label>
            <Controller
              name="states"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={Object.keys(stateCityData).map((state) => ({
                    value: state,
                    label: state,
                  }))}
                  isMulti
                  classNamePrefix="select"
                  onChange={(selectedOptions) => {
                    setSelectedStates(selectedOptions);
                    setValue("states", selectedOptions);
                    setValue("cities", []);
                  }}
                />
              )}
            />
            <p className="text-red-500 text-sm">{errors.states?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Select Cities
            </label>
            <Controller
              name="cities"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={availableCities.map((city) => ({
                    value: city,
                    label: city,
                  }))}
                  isMulti
                  classNamePrefix="select"
                  onChange={(selectedOptions) =>
                    setValue("cities", selectedOptions)
                  }
                  isDisabled={selectedStateNames.length === 0}
                />
              )}
            />
            <p className="text-red-500 text-sm">{errors.cities?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
