import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailsTemplets.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recepient = [{email}];

    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully", res)
    } catch (error) {
        console.log("Error in sending verification email", error)
        throw new Error(`Error in sending verification email ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recepient = [{email}];

    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recepient,
            template_uuid: "6c0e7372-6f3b-458c-84ec-6052c8d505bb",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name
            }
        });

        console.log("Welcome Email sent successfully" , res)
    } catch (error) {
        console.log(error);
    }
}

export const sendResetPasswordEmail = async (email, reseturl) => {
    const recepient = [{email}];

    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', reseturl),
            category: "Password Reset"
        })
    } catch (error) {
        console.log("Error in sending reset password email", error);
        throw new Error("Error in sending reset password email");
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recepient = [{email}];
    
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Reset your password successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Successfully"
        })
    } catch (error) {
        console.log("Error in sending reset password success email", error);
        throw new Error("Error in sending reset password success email");
    }
}