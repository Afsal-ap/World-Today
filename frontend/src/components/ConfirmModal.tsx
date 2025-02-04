// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader, 
//   ModalBody,
//   ModalFooter,
//   Button,
// } from '@chakra-ui/react';

// interface ConfirmModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   title?: string;
//   message?: string;
//   confirmText?: string;
//   cancelText?: string;
// }

// export const ConfirmModal = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   title = 'Confirm Action',
//   message = 'Are you sure you want to proceed?',
//   confirmText = 'Confirm',
//   cancelText = 'Cancel',
// }: ConfirmModalProps) => {
//   const handleConfirm = () => {
//     onConfirm();
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>{title}</ModalHeader>
//         <ModalBody>{message}</ModalBody>
//         <ModalFooter>
//           <Button variant="ghost" mr={3} onClick={onClose}>
//             {cancelText}
//           </Button>
//           <Button colorScheme="blue" onClick={handleConfirm}>
//             {confirmText}
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };
