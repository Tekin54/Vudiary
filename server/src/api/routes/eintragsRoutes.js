import express from 'express';
import {
  getEintrag,
  getEintragById,
  changeEintragById,
  insertEintrag,
  deleteEintrag,
} from '../../controller/eintragController.js';

const router = express.Router();

router.get('/', getEintrag);
router.get('/:id', getEintragById);
router.patch('/:id', changeEintragById);
router.post('/', insertEintrag);
router.delete('/:id', deleteEintrag);
export default router;
