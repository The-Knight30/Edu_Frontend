import LoadingSpinner from './LoadingSpinner';

// Transparent modal component
const Modal = () => {
    return <div className="fixed inset-0 z-40 bg-black bg-opacity-10"></div>;
};

// Spinner modal component
const SpinnerModal = ({ isLoading }) => {
    return (
        <div>
            {/* Conditional rendering of spinner and modal */}
            {isLoading && <LoadingSpinner />}
            {isLoading && <Modal />}
        </div>
    );
};

export default SpinnerModal;
