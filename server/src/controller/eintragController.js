import asyncHandler from 'express-async-handler';
import * as model from '../model/eintragModel.js';

// eslint-disable-next-line import/prefer-default-export
export const getEintrag = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getEintrag());
});

export const getEintragById = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getEintragById(req.params.id));
});

export const changeEintragById = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      await model.changeEintragById(
        req.params.id,
        req.body.title,
        req.body.description,
        req.body.mood,
        req.body.last_changed_date,
        req.body.last_changed_time,
        req.body.last_changed,
      ),
    );
});
export const insertEintrag = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      await model.insertEintrag(
        req.body.title,
        req.body.page,
        req.body.description,
        req.body.date,
        req.body.mood,
        req.body.ort,
        req.body.straße,
        req.body.plz,
        req.body.time,
      ),
    );
});
export const deleteentry = asyncHandler(async (req, res) => {
  res.status(200).json(await model.deleteentry(req.params.id));
});
