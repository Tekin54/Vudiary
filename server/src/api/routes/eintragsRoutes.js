import express from 'express';
import {
  getEintrag,
  getEintragById,
  changeEintragById,
  insertEintrag,
  deleteEintrag,
} from '../../controller/eintragController.js';

const router = express.Router();

router.get('/eintraege', getEintrag);
router.get('/eintraege/:id', getEintragById);
router.patch('/eintraege/:id', changeEintragById);
router.post('/eintraege/', insertEintrag);
router.delete('/eintraege/:id', deleteEintrag);
export default router;
