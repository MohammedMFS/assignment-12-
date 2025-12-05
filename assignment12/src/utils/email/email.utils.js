import nodemailer from "nodemailer"

export async function sendEmail({
    to = '',
    subject = '',
    text = '',
    Attachments =[],
    html = ''

}){
  const transporter = nodemailer.createTransport(
     { service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

const info = await transporter.sendMail({
    from:`Route Academy 😊 <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    Attachments,
    html,
})

console.log('message'+':'+info.messageId);

}


export const emailsubject = {
    confirmEmail:"please confirm yur email",
    resetPass:"please reset ur pass"
}


