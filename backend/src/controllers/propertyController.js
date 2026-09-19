
// Import the Property model
import { property } from "../Models/propertyModel.js";

// Import API features for filtering, searching and pagination
import { APIFeatures } from "../utils/APIFeatures.js";

// Import ImageKit for image uploads
import imagekit from "../utils/ImagekitIO.js";


// =====================================================
// GET ALL PROPERTIES
// =====================================================

const getProperties = async (req, res) => {
    try {

        // Create API features using all properties
        const features = new APIFeatures(
            property.find(),
            req.query
        )
            .filter()
            .search()
            .paginate();

        // Execute the query
        const doc = await features.query;

        // Send the properties to frontend
        res.status(200).json({
            status: "success",
            no_of_responses: doc.length,
            data: doc
        });

    } catch (error) {

        console.error("Error searching properties: ", error);

        res.status(500).json({
            status: "fail",
            message: "Internal server Error"
        });
    }
};


// =====================================================
// GET PROPERTY BY ID
// =====================================================

const getProperty = async (req, res) => {
    try {

        // Find property using the ID from URL
        const propertyData = await property.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: propertyData
        });

    } catch (error) {

        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
};


// =====================================================
// CREATE A PROPERTY
// =====================================================

const createProperty = async (req, res) => {
    try {

        // Get property details from request body
        const {
            propertyName,
            description,
            propertyType,
            roomType,
            extraInfo,
            address,
            amenities,
            checkInTime,
            checkOutTime,
            maximumGuest,
            price,
            images
        } = req.body;


        // Array to store uploaded images
        const uploadedImages = [];


        // Upload each image to ImageKit
        for (const image of images) {

            const result = await imagekit.upload({
                file: image.url,
                fileName: `property_${Date.now()}.jpg`,
                folder: "property_images"
            });

            // Store ImageKit URL and ID
            uploadedImages.push({
                url: result.url,
                public_id: result.fileId
            });
        }


        // Create and save the property
        const propertyData = await property.create({

            propertyName,
            description,
            propertyType,
            roomType,
            extraInfo,
            address,
            amenities,
            checkInTime,
            checkOutTime,
            maximumGuest,
            price,

            // Save uploaded image information
            images: uploadedImages,

            // Get owner ID from logged-in user
            userId: req.user.id
        });


        // Send success response
        res.status(200).json({
            status: "success",
            data: {
                data: propertyData
            }
        });

    } catch (error) {

        console.error("Error creating property: ", error);

        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
};


// =====================================================
// GET MY PROPERTIES
// =====================================================

const getUsersProperties = async (req, res) => {
    try {

        // Get the logged-in user's ID
        const userId = req.user._id;

        // Find all properties owned by this user
        const properties = await property.find({
            userId: userId
        });

        // Send properties to frontend
        res.status(200).json({
            status: "success",
            data: properties
        });

    } catch (error) {

        console.error("Error getting user's properties: ", error);

        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

export {
    getProperties,
    getProperty,
    createProperty,
    getUsersProperties
};
