import Modal from "@/components/Modal";
import NewsDetails from "@/components/NewsDetails";

const NewsModal = ({ params: { slug, lang } }) => {
  return (
    <Modal>
      <NewsDetails slug={slug} lang={lang} />
    </Modal>
  );
};

export default NewsModal;
