import Modal from "@/components/Modal";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterModal() {
    return (
        <Modal>
            <RegisterForm isModal={true} />
        </Modal>
    );
}
