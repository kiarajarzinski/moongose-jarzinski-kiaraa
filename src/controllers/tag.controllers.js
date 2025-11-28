import { TagModel } from "../models/tag.model.js";
import { PostModel } from "../models/post.model.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await TagModel.find({ isDeleted: { $ne: true } });
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener tags' });
  }
};

export const getTagById = async (req, res) => {
  try {
    const tag = await TagModel.findById(req.params.id);
    if (!tag || tag.isDeleted) return res.status(404).json({ msg: 'Tag no encontrado' });
    // populate
    await tag.populate('posts');
    res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener tag' });
  }
};

export const createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;
    const newTag = await TagModel.create({ tag_name });
    res.status(201).json({ msg: 'Tag creado', tag: newTag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear tag' });
  }
};

export const updateTag = async (req, res) => {
  try {
    const tag = await TagModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tag) return res.status(404).json({ msg: 'Tag no encontrado' });
    res.status(200).json({ msg: 'Tag actualizado', tag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar tag' });
  }
};

// eliminacion logica y en cascada
export const deleteTag = async (req, res) => {
  try {
    const tag = await TagModel.findById(req.params.id);
    if (!tag) return res.status(404).json({ msg: 'Tag no encontrado' });

    tag.isDeleted = true;
    await tag.save();

    // eliminar referencias de tag en posts
    await PostModel.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });

    res.status(200).json({ msg: 'Tag eliminado logicamente y removido de posts en cascada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar tag' });
  }
};

export default { getAllTags, getTagById, createTag, updateTag, deleteTag };
