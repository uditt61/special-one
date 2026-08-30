import { GiftDraft } from '@/types/gift';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateStep(step: number, draft: GiftDraft): ValidationResult {
  const errors: Record<string, string> = {};

  switch (step) {
    case 1:
      if (!draft.recipientName || !draft.recipientName.trim()) {
        errors.recipientName = "Please enter the recipient's name.";
      } else if (draft.recipientName.trim().length > 50) {
        errors.recipientName = 'Name should be under 50 characters.';
      }

      if (!draft.senderName || !draft.senderName.trim()) {
        errors.senderName = 'Please enter your name.';
      } else if (draft.senderName.trim().length > 50) {
        errors.senderName = 'Name should be under 50 characters.';
      }

      if (!draft.openingMessage || !draft.openingMessage.trim()) {
        errors.openingMessage = 'Please enter an opening message.';
      } else if (draft.openingMessage.trim().length > 120) {
        errors.openingMessage = 'Opening message should be under 120 characters.';
      }
      break;

    case 2:
      if (!draft.occasion) {
        errors.occasion = 'Please choose what this gift is for.';
      }
      if (!draft.relationship) {
        errors.relationship = 'Please select your relationship.';
      }
      if (!draft.relationshipStyle) {
        errors.relationshipStyle = 'Please select how you two are together.';
      }
      break;

    case 3:
      // Photos are optional but recommended
      if (draft.photos && draft.photos.length > 8) {
        errors.photos = 'You can add up to 8 photos.';
      }
      break;

    case 4:
      if (draft.loveLetter && draft.loveLetter.length > 500) {
        errors.loveLetter = 'Love letter should be within 500 characters.';
      }
      if (draft.reasons && draft.reasons.length > 5) {
        errors.reasons = 'You can choose up to 5 reasons.';
      }
      break;

    case 5:
      // Voice message is optional
      break;

    case 6:
      if (!draft.theme) {
        errors.theme = 'Please select a background theme mood.';
      }
      break;

    default:
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
