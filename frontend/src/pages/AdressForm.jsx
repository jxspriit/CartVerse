import React, { useEffect, useState } from "react";

import {
    MapPin,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    Home,
    Phone,
    User,
    ShoppingBag,
    Truck,
    CreditCard,
    Package,
} from "lucide-react";

import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";

import { getCart } from "@/redux/CartSlice";

import {
    createOrder,
    verifyPayment,
} from "@/redux/OrderSlice";


// =====================================
// ADDRESS FORM
// =====================================

const AddressForm = () => {

    const dispatch = useDispatch();


    // =====================================
    // REDUX STATE
    // =====================================

    const cartItems = useSelector(
        (state) => state.cart.cart
    );

    const {
        loading: orderLoading,
        paymentLoading,
    } = useSelector(
        (state) => state.order
    );


    // =====================================
    // LOCAL STATES
    // =====================================

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [addresses, setAddresses] =
        useState([]);

    const [selectedAddress, setSelectedAddress] =
        useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNo: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
    });


    // =====================================
    // LOAD ADDRESS + CART
    // =====================================

    useEffect(() => {

        const savedAddresses =
            JSON.parse(
                localStorage.getItem(
                    "savedAddresses"
                )
            ) || [];


        setAddresses(savedAddresses);


        if (savedAddresses.length > 0) {

            setSelectedAddress(
                savedAddresses[0]._id
            );

        }


        dispatch(getCart());

    }, [dispatch]);


    // =====================================
    // INPUT CHANGE
    // =====================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // =====================================
    // RESET FORM
    // =====================================

    const resetForm = () => {

        setFormData({
            fullName: "",
            phoneNo: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
        });

    };


    // =====================================
    // SAVE / UPDATE ADDRESS
    // =====================================

    const handleSaveAddress = (e) => {

        e.preventDefault();


        if (
            !formData.fullName.trim() ||
            !formData.phoneNo.trim() ||
            !formData.address.trim() ||
            !formData.city.trim() ||
            !formData.state.trim() ||
            !formData.zipCode.trim()
        ) {

            toast.error(
                "Please fill all fields"
            );

            return;

        }


        // UPDATE ADDRESS

        if (editingId) {

            const updated =
                addresses.map((item) =>
                    item._id === editingId
                        ? {
                            ...item,
                            ...formData,
                        }
                        : item
                );


            setAddresses(updated);


            localStorage.setItem(
                "savedAddresses",
                JSON.stringify(updated)
            );


            toast.success(
                "Address updated successfully!"
            );


            setEditingId(null);
            setShowForm(false);

            resetForm();

            return;

        }


        // CREATE ADDRESS

        const newAddress = {

            _id:
                Date.now().toString(),

            ...formData,

        };


        const updated = [
            ...addresses,
            newAddress,
        ];


        setAddresses(updated);


        localStorage.setItem(
            "savedAddresses",
            JSON.stringify(updated)
        );


        setSelectedAddress(
            newAddress._id
        );


        toast.success(
            "Address saved successfully!"
        );


        setShowForm(false);

        resetForm();

    };


    // =====================================
    // ADD ADDRESS
    // =====================================

    const handleAddAddress = () => {

        resetForm();

        setEditingId(null);

        setShowForm(true);

    };


    // =====================================
    // EDIT ADDRESS
    // =====================================

    const handleEdit = (item) => {

        setFormData({

            fullName:
                item.fullName || "",

            phoneNo:
                item.phoneNo || "",

            address:
                item.address || "",

            city:
                item.city || "",

            state:
                item.state || "",

            zipCode:
                item.zipCode || "",

        });


        setEditingId(item._id);

        setShowForm(true);

    };


    // =====================================
    // DELETE ADDRESS
    // =====================================

    const handleDelete = (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this address?"
            );


        if (!confirmDelete) return;


        const updated =
            addresses.filter(
                (item) =>
                    item._id !== id
            );


        setAddresses(updated);


        localStorage.setItem(
            "savedAddresses",
            JSON.stringify(updated)
        );


        if (selectedAddress === id) {

            setSelectedAddress(
                updated.length > 0
                    ? updated[0]._id
                    : null
            );

        }


        toast.success(
            "Address deleted successfully!"
        );

    };


    // =====================================
    // SELECT ADDRESS
    // =====================================

    const handleSelect = (id) => {

        setSelectedAddress(id);

    };


    // =====================================
    // CANCEL
    // =====================================

    const handleCancel = () => {

        setShowForm(false);

        setEditingId(null);

        resetForm();

    };


    // =====================================
    // SELECTED ADDRESS
    // =====================================

    const selectedAddressData =
        addresses.find(
            (item) =>
                item._id === selectedAddress
        );


    // =====================================
    // PRODUCT PRICE
    // =====================================

    const getProductPrice = (item) => {

        return Number(
            item.productId?.productprice ??
            item.productId?.price ??
            item.price ??
            0
        );

    };


    // =====================================
    // PRODUCT NAME
    // =====================================

    const getProductName = (item) => {

        return (
            item.productId?.productname ||
            item.productId?.name ||
            "Product"
        );

    };


    // =====================================
    // PRODUCT IMAGE
    // =====================================

    const getProductImage = (item) => {

        return (
            item.productId?.productImg?.[0]?.Url ||
            item.productId?.image ||
            ""
        );

    };


    // =====================================
    // QUANTITY
    // =====================================

    const getQuantity = (item) => {

        return Number(
            item.quantity || 1
        );

    };


    // =====================================
    // SUBTOTAL
    // =====================================

    const subtotal = cartItems.reduce(
        (total, item) => {

            return (
                total +
                getProductPrice(item) *
                getQuantity(item)
            );

        },
        0
    );


    // =====================================
    // TAX
    // =====================================

    const TAX_RATE = 0.18;

    const tax =
        subtotal * TAX_RATE;


    // =====================================
    // SHIPPING
    // =====================================

    const FREE_SHIPPING_LIMIT = 1000;

    const SHIPPING_CHARGE = 50;

    const deliveryCharge =
        subtotal >= FREE_SHIPPING_LIMIT
            ? 0
            : subtotal > 0
                ? SHIPPING_CHARGE
                : 0;


    // =====================================
    // FINAL TOTAL
    // =====================================

    const total =
        subtotal +
        tax +
        deliveryCharge;


    // =====================================
    // OPEN RAZORPAY
    // =====================================

    const openRazorpayCheckout = (
        razorpayOrder
    ) => {

        if (!window.Razorpay) {

            toast.error(
                "Razorpay Checkout is not loaded"
            );

            return;

        }


        const options = {

            key:
                import.meta.env
                    .VITE_RAZORPAY_KEY,

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency,

            name:
                "CartVerse",

            description:
                "CartVerse Order",

            order_id:
                razorpayOrder.id,


            // =====================================
            // PAYMENT SUCCESS
            // =====================================

            handler:
                async function (response) {

                    try {

                        console.log(
                            "RAZORPAY RESPONSE:",
                            response
                        );


                        await dispatch(
                            verifyPayment({

                                razorpay_order_id:
                                    response.razorpay_order_id,

                                razorpay_payment_id:
                                    response.razorpay_payment_id,

                                razorpay_signature:
                                    response.razorpay_signature,

                            })
                        ).unwrap();


                        toast.success(
                            "Payment successful! Order placed."
                        );


                        dispatch(
                            getCart()
                        );


                    } catch (error) {

                        console.error(
                            "PAYMENT VERIFY ERROR:",
                            error
                        );


                        toast.error(
                            typeof error ===
                                "string"
                                ? error
                                : "Payment verification failed"
                        );

                    }

                },


            // =====================================
            // PREFILL
            // =====================================

            prefill: {

                name:
                    selectedAddressData
                        ?.fullName || "",

                contact:
                    selectedAddressData
                        ?.phoneNo || "",

            },


            // =====================================
            // NOTES
            // =====================================

            notes: {

                address:
                    selectedAddressData
                        ?.address || "",

                city:
                    selectedAddressData
                        ?.city || "",

                state:
                    selectedAddressData
                        ?.state || "",

                zipCode:
                    selectedAddressData
                        ?.zipCode || "",

            },


            theme: {

                color:
                    "#ec4899",

            },

        };


        const razorpay =
            new window.Razorpay(
                options
            );


        razorpay.on(
            "payment.failed",
            function (response) {

                console.error(
                    "PAYMENT FAILED:",
                    response
                );


                toast.error(
                    "Payment failed. Please try again."
                );

            }
        );


        razorpay.open();

    };


    // =====================================
    // PLACE ORDER
    // =====================================

    const handlePlaceOrder =
        async () => {

            try {

                // ADDRESS CHECK

                if (!selectedAddressData) {

                    toast.error(
                        "Please select a delivery address"
                    );

                    return;

                }


                // CART CHECK

                if (
                    !cartItems ||
                    cartItems.length === 0
                ) {

                    toast.error(
                        "Your cart is empty"
                    );

                    return;

                }


                // =====================================
                // CREATE PRODUCTS ARRAY
                // =====================================

                const products =
                    cartItems.map(
                        (item) => ({

                            productId:
                                item.productId?._id,

                            quantity:
                                Number(
                                    item.quantity
                                ),

                        })
                    );


                // =====================================
                // CHECK PRODUCT IDS
                // =====================================

                const invalidProduct =
                    products.some(
                        (item) =>
                            !item.productId
                    );


                if (invalidProduct) {

                    toast.error(
                        "Invalid product in cart"
                    );

                    return;

                }


                console.log(
                    "ORDER PRODUCTS:",
                    products
                );


                // =====================================
                // FINAL AMOUNTS
                // =====================================

                const finalSubtotal =
                    Number(
                        subtotal.toFixed(2)
                    );

                const finalTax =
                    Number(
                        tax.toFixed(2)
                    );

                const finalShipping =
                    Number(
                        deliveryCharge.toFixed(2)
                    );

                const finalTotal =
                    Number(
                        total.toFixed(2)
                    );


                console.log(
                    "SUBTOTAL:",
                    finalSubtotal
                );

                console.log(
                    "TAX:",
                    finalTax
                );

                console.log(
                    "SHIPPING:",
                    finalShipping
                );

                console.log(
                    "TOTAL:",
                    finalTotal
                );


                // =====================================
                // CREATE ORDER
                // =====================================

                const result =
                    await dispatch(
                        createOrder({

                            products,

                            amount:
                                finalTotal,

                            tax:
                                finalTax,

                            shipping:
                                finalShipping,

                            currency:
                                "INR",

                        })
                    ).unwrap();


                console.log(
                    "ORDER CREATED:",
                    result
                );


                // =====================================
                // OPEN RAZORPAY
                // =====================================

                openRazorpayCheckout(
                    result.razorpayOrder
                );


            } catch (error) {

                console.error(
                    "PLACE ORDER ERROR:",
                    error
                );


                toast.error(
                    typeof error ===
                        "string"
                        ? error
                        : "Unable to create order"
                );

            }

        };


    // =====================================
    // UI
    // =====================================

    return (

        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-5">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">


                {/* =====================================
                    LEFT SIDE
                ===================================== */}

                <div className="lg:col-span-2">

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">


                        {/* HEADER */}

                        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100">

                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">

                                    <MapPin
                                        size={19}
                                        className="text-pink-600"
                                    />

                                </div>

                                <div>

                                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                                        Delivery Address
                                    </h1>

                                    <p className="text-xs text-gray-500">
                                        Select your delivery address
                                    </p>

                                </div>

                            </div>


                            {!showForm && (

                                <button
                                    type="button"
                                    onClick={
                                        handleAddAddress
                                    }
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm font-semibold transition"
                                >

                                    <Plus size={16} />

                                    <span className="hidden sm:inline">
                                        Add New Address
                                    </span>

                                    <span className="sm:hidden">
                                        Add
                                    </span>

                                </button>

                            )}

                        </div>


                        {/* =====================================
                            ADDRESS FORM
                        ===================================== */}

                        {showForm && (

                            <div className="border-b border-gray-100">

                                <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gray-50">

                                    <div>

                                        <h2 className="font-semibold text-gray-800 text-sm">

                                            {editingId
                                                ? "Edit Address"
                                                : "Add New Address"}

                                        </h2>

                                        <p className="text-[11px] text-gray-500">
                                            Enter your delivery details
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                    >

                                        <X size={15} />

                                    </button>

                                </div>


                                <form
                                    onSubmit={
                                        handleSaveAddress
                                    }
                                    className="p-4 sm:p-5 space-y-3"
                                >

                                    {/* NAME + PHONE */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <div>

                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                Full Name
                                            </label>

                                            <div className="relative">

                                                <User
                                                    size={15}
                                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={
                                                        formData.fullName
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Full name"
                                                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs sm:text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-50"
                                                />

                                            </div>

                                        </div>


                                        <div>

                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                Phone Number
                                            </label>

                                            <div className="relative">

                                                <Phone
                                                    size={15}
                                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="tel"
                                                    name="phoneNo"
                                                    value={
                                                        formData.phoneNo
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Phone number"
                                                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs sm:text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-50"
                                                />

                                            </div>

                                        </div>

                                    </div>


                                    {/* ADDRESS */}

                                    <div>

                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Address
                                        </label>

                                        <div className="relative">

                                            <Home
                                                size={15}
                                                className="absolute left-2.5 top-2.5 text-gray-400"
                                            />

                                            <textarea
                                                name="address"
                                                rows="2"
                                                value={
                                                    formData.address
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="House no, street, area..."
                                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs sm:text-sm outline-none resize-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-50"
                                            />

                                        </div>

                                    </div>


                                    {/* CITY + STATE */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <div>

                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                City
                                            </label>

                                            <input
                                                type="text"
                                                name="city"
                                                value={
                                                    formData.city
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="City"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs sm:text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-50"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                State
                                            </label>

                                            <input
                                                type="text"
                                                name="state"
                                                value={
                                                    formData.state
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="State"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs sm:text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-50"
                                            />

                                        </div>

                                    </div>


                                    {/* ZIP */}

                                    <div className="sm:w-1/2">

                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            ZIP Code
                                        </label>

                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={
                                                formData.zipCode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="ZIP code"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs sm:text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-50"
                                        />

                                    </div>


                                    {/* BUTTONS */}

                                    <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">

                                        <button
                                            type="button"
                                            onClick={
                                                handleCancel
                                            }
                                            className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="flex-1 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm font-semibold transition"
                                        >

                                            {editingId
                                                ? "Update Address"
                                                : "Save Address"}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        )}


                        {/* =====================================
                            SAVED ADDRESSES
                        ===================================== */}

                        <div className="p-4 sm:p-5">

                            <div className="flex items-center justify-between mb-3">

                                <div>

                                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                        Saved Addresses
                                    </h2>

                                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                                        Choose where you want your order delivered
                                    </p>

                                </div>


                                {addresses.length > 0 && (

                                    <span className="text-xs font-medium text-pink-600">

                                        {addresses.length} saved

                                    </span>

                                )}

                            </div>


                            {addresses.length === 0 ? (

                                <div className="border border-dashed border-gray-300 rounded-xl p-7 text-center">

                                    <div className="w-11 h-11 mx-auto rounded-full bg-pink-50 flex items-center justify-center">

                                        <MapPin
                                            size={20}
                                            className="text-pink-500"
                                        />

                                    </div>


                                    <p className="font-medium text-gray-700 text-sm mt-3">
                                        No saved address
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Add an address to continue with your order
                                    </p>


                                    <button
                                        type="button"
                                        onClick={
                                            handleAddAddress
                                        }
                                        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold"
                                    >

                                        <Plus size={15} />

                                        Add Address

                                    </button>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {addresses.map(
                                        (item) => (

                                            <div
                                                key={
                                                    item._id
                                                }
                                                onClick={() =>
                                                    handleSelect(
                                                        item._id
                                                    )
                                                }
                                                className={`relative cursor-pointer rounded-xl border-2 p-3.5 transition ${
                                                    selectedAddress ===
                                                    item._id
                                                        ? "border-pink-400 bg-pink-50/30"
                                                        : "border-gray-200 hover:border-pink-200"
                                                }`}
                                            >

                                                <div
                                                    className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${
                                                        selectedAddress ===
                                                        item._id
                                                            ? "bg-pink-500"
                                                            : "border border-gray-300"
                                                    }`}
                                                >

                                                    {selectedAddress ===
                                                        item._id && (

                                                        <Check
                                                            size={12}
                                                            className="text-white"
                                                        />

                                                    )}

                                                </div>


                                                <div className="flex items-start gap-2.5 pr-7">

                                                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">

                                                        <MapPin
                                                            size={16}
                                                            className="text-pink-500"
                                                        />

                                                    </div>


                                                    <div>

                                                        <h3 className="font-semibold text-gray-800 text-sm">
                                                            {
                                                                item.fullName
                                                            }
                                                        </h3>

                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {
                                                                item.phoneNo
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                <p className="text-xs sm:text-sm text-gray-600 leading-5 mt-2.5 sm:ml-10">

                                                    {
                                                        item.address
                                                    }

                                                    <br />

                                                    {
                                                        item.city
                                                    }
                                                    ,{" "}
                                                    {
                                                        item.state
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        item.zipCode
                                                    }

                                                </p>


                                                <div className="flex gap-2 mt-3 sm:ml-10">

                                                    <button
                                                        type="button"
                                                        onClick={(
                                                            e
                                                        ) => {

                                                            e.stopPropagation();

                                                            handleEdit(
                                                                item
                                                            );

                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 text-xs font-medium"
                                                    >

                                                        <Edit
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        Edit

                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={(
                                                            e
                                                        ) => {

                                                            e.stopPropagation();

                                                            handleDelete(
                                                                item._id
                                                            );

                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-medium"
                                                    >

                                                        <Trash2
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        Delete

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* SELECTED ADDRESS */}

                    {selectedAddress &&
                        addresses.length > 0 && (

                            <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2">

                                <Check
                                    size={16}
                                    className="text-green-600 shrink-0"
                                />

                                <p className="text-xs text-green-700">
                                    Delivery address selected successfully.
                                </p>

                            </div>

                        )}

                </div>


                {/* =====================================
                    ORDER SUMMARY
                ===================================== */}

                <div className="lg:col-span-1">

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm lg:sticky lg:top-5 overflow-hidden">


                        {/* HEADER */}

                        <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100">

                            <div className="flex items-center gap-2.5">

                                <div className="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center">

                                    <ShoppingBag
                                        size={18}
                                        className="text-pink-600"
                                    />

                                </div>


                                <div>

                                    <h2 className="text-base sm:text-lg font-bold text-gray-800">
                                        Order Summary
                                    </h2>

                                    <p className="text-[11px] text-gray-500">
                                        Review your order
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ITEMS */}

                        <div className="p-4 sm:p-5">

                            {cartItems.length === 0 ? (

                                <div className="text-center py-6">

                                    <div className="w-11 h-11 mx-auto rounded-full bg-gray-100 flex items-center justify-center">

                                        <ShoppingBag
                                            size={20}
                                            className="text-gray-400"
                                        />

                                    </div>


                                    <p className="text-sm font-medium text-gray-700 mt-2">
                                        Your cart is empty
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Add products to continue
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {cartItems.map(
                                        (item, index) => {

                                            const price =
                                                getProductPrice(
                                                    item
                                                );

                                            const quantity =
                                                getQuantity(
                                                    item
                                                );

                                            const image =
                                                getProductImage(
                                                    item
                                                );


                                            return (

                                                <div
                                                    key={
                                                        item.productId?._id ||
                                                        index
                                                    }
                                                    className="flex gap-2.5"
                                                >

                                                    <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">

                                                        {image ? (

                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={
                                                                    getProductName(
                                                                        item
                                                                    )
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />

                                                        ) : (

                                                            <div className="w-full h-full flex items-center justify-center">

                                                                <Package
                                                                    size={
                                                                        18
                                                                    }
                                                                    className="text-gray-400"
                                                                />

                                                            </div>

                                                        )}

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">

                                                            {
                                                                getProductName(
                                                                    item
                                                                )
                                                            }

                                                        </h3>


                                                        <div className="flex items-center justify-between mt-1.5">

                                                            <span className="text-[11px] text-gray-500">

                                                                Qty:{" "}
                                                                {
                                                                    quantity
                                                                }

                                                            </span>


                                                            <span className="text-xs sm:text-sm font-bold text-gray-800">

                                                                ₹
                                                                {(
                                                                    price *
                                                                    quantity
                                                                ).toFixed(2)}

                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}


                            {/* =====================================
                                PRICE BREAKDOWN
                            ===================================== */}

                            {cartItems.length > 0 && (

                                <>

                                    <div className="border-t border-gray-100 my-4" />


                                    <div className="space-y-2.5">


                                        {/* SUBTOTAL */}

                                        <div className="flex justify-between text-xs sm:text-sm">

                                            <span className="text-gray-500">
                                                Subtotal
                                            </span>

                                            <span className="font-medium text-gray-800">

                                                ₹
                                                {subtotal.toFixed(2)}

                                            </span>

                                        </div>


                                        {/* TAX */}

                                        <div className="flex justify-between text-xs sm:text-sm">

                                            <span className="text-gray-500">
                                                Tax (18%)
                                            </span>

                                            <span className="font-medium text-gray-800">

                                                ₹
                                                {tax.toFixed(2)}

                                            </span>

                                        </div>


                                        {/* SHIPPING */}

                                        <div className="flex justify-between text-xs sm:text-sm">

                                            <span className="text-gray-500">
                                                Delivery
                                            </span>


                                            {deliveryCharge === 0 ? (

                                                <span className="font-medium text-green-600">
                                                    FREE
                                                </span>

                                            ) : (

                                                <span className="font-medium text-gray-800">
                                                    ₹
                                                    {deliveryCharge.toFixed(2)}
                                                </span>

                                            )}

                                        </div>


                                        {/* TOTAL */}

                                        <div className="border-t border-dashed border-gray-200 pt-2.5">

                                            <div className="flex justify-between items-center">

                                                <span className="font-bold text-gray-800 text-sm">
                                                    Total
                                                </span>

                                                <span className="font-bold text-pink-600 text-lg">

                                                    ₹
                                                    {total.toFixed(2)}

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </>

                            )}


                            {/* DELIVERY ADDRESS */}

                            {selectedAddressData && (

                                <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-3">

                                    <div className="flex items-center gap-1.5 mb-1.5">

                                        <Truck
                                            size={14}
                                            className="text-pink-500"
                                        />

                                        <span className="text-[11px] font-semibold text-gray-700">
                                            Delivering To
                                        </span>

                                    </div>


                                    <p className="text-xs font-semibold text-gray-800">

                                        {
                                            selectedAddressData.fullName
                                        }

                                    </p>


                                    <p className="text-[11px] text-gray-500 mt-0.5 leading-4">

                                        {
                                            selectedAddressData.address
                                        }
                                        ,{" "}
                                        {
                                            selectedAddressData.city
                                        }
                                        ,{" "}
                                        {
                                            selectedAddressData.state
                                        }{" "}
                                        -{" "}
                                        {
                                            selectedAddressData.zipCode
                                        }

                                    </p>

                                </div>

                            )}


                            {/* PAYMENT */}

                            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-50">

                                <CreditCard
                                    size={14}
                                    className="text-pink-500"
                                />

                                <p className="text-[11px] text-pink-700">
                                    Secure payment available at checkout
                                </p>

                            </div>


                            {/* PLACE ORDER */}

                            <button
                                type="button"
                                onClick={
                                    handlePlaceOrder
                                }
                                disabled={
                                    orderLoading ||
                                    paymentLoading ||
                                    cartItems.length === 0
                                }
                                className="w-full mt-4 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm transition"
                            >

                                {orderLoading
                                    ? "Creating Order..."
                                    : paymentLoading
                                        ? "Verifying Payment..."
                                        : "Place Order"}

                            </button>


                            <p className="text-[10px] text-gray-400 text-center mt-2.5 leading-4">

                                By placing your order, you agree to our terms
                                and conditions.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AddressForm;