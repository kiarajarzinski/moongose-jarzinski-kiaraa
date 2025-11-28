import { PostModel } from "../models/post.model.js";
import { UserModel } from "../models/user.model.js";
import { TagModel } from "../models/tag.model.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ isDeleted: { $ne: true } }).populate('author').populate('tags');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener posts' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id).populate('author').populate('tags');
    if (!post || post.isDeleted) return res.status(404).json({ msg: 'Post no encontrado' });
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener post' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description, author, tags } = req.body;
    // validar author
    const user = await UserModel.findById(author);
    if (!user || user.isDeleted) return res.status(400).json({ msg: 'Author inválido' });

    const newPost = await PostModel.create({ title, description, author, tags });
    res.status(201).json({ msg: 'Post creado', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear post' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
    res.status(200).json({ msg: 'Post actualizado', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
    post.isDeleted = true;
    await post.save();
    res.status(200).json({ msg: 'Post eliminado logicamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar post' });
  }
};

// relacion n a m
export const addTagToPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post || post.isDeleted) return res.status(404).json({ msg: 'Post no encontrado' });

    const { tagId } = req.body;
    const tag = await TagModel.findById(tagId);
    if (!tag || tag.isDeleted) return res.status(400).json({ msg: 'Tag inválido' });

    // evitar duplicados
    if (!post.tags.some(t => t.toString() === tagId)) {
      post.tags.push(tagId);
      await post.save();
    }

    res.status(200).json({ msg: 'Tag añadido al post', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al añadir tag al post' });
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addTagToPost,
};
