import { mergeClasses } from "../../lib/utils";

type MailLinkProps = {
    mail: string;
    className?: string;
}

export const MailLink = (props: MailLinkProps) => {
    const {
        mail,
        className
    } = props;

    return <a href={`mailto:${mail}`} className={mergeClasses(className)}>{mail}</a>
}


type PhoneLinkProps = {
    phone: string;
    className?: string;
}

export const PhoneLink = (props: PhoneLinkProps) => {
    const {
        phone,
        className
    } = props;

    return <a href={`tel:${purgePhoneLink(phone)}`} className={mergeClasses(className)}>{phone}</a>
}

const purgePhoneLink = (phone: string) => {
    if (phone.startsWith("0")) {
        return phone.replace("0", "+33")
    }

    return phone;
}