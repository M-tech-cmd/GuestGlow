import User from "../models/User.js" ;
import {Webhook} from "svix" ;

// This function handles incoming webhooks from Clerk.
const clerkWebhooks = async (req, res)=>{ 

    try{
        // Create a SVIX instance using the Clerk webhook secret from environment variables.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Extract the necessary headers for verification.
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // Verify the webhook's authenticity using the request body and headers.
        await whook.verify(JSON.stringify(req.body), headers)

        // Destructure the data and event type from the request body.
        const {data, type} = req.body

        // Create a user data object to store in the database.
        // This structure maps the Clerk user data to your User model's schema.
        const userData = {
            _id : data.id,
            email : data.email_addresses[0].email_address,
            username : data.first_name + " " + data.last_name,
            image : data.image_url,
        }

        console.log(type, data);
        
        // A switch case to handle different webhook event types.
        switch (type) {
            // Case for when a new user is created.
            case "user.created" : {
                console.log("Check Message - User ID Created ");
                // Create a new user in the database.
                await User.create(userData);
                break;
            }

            // Case for when an existing user is updated.
            case "user.updated" : {
                console.log("Check Message - User ID Updated ");
                // Find and update the user in the database.
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

            // Case for when a user is deleted.
            case "user.deleted" : {
                console.log("Check Message - User ID Deleted ");
                // Find and delete the user from the database.
                await User.findByIdAndDelete(data.id);
                break;
            }
                
            default:
                break;
        }

        // Send a success response.
        res.json({success: true, message: "WebHook Received" }) ;

    } catch(error){
        // Log the error and send a failure response.
        console.error("Webhook error:", error.message);
        res.status(400).json( {success: false, message: error.message});
    }

}

export default clerkWebhooks ;
