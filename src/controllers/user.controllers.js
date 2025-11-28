import { UserModel } from "../models/user.model.js";
import { PostModel } from "../models/post.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ isDeleted: { $ne: true } }).populate('posts');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate('posts');
    if (!user || user.isDeleted) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;
    const newUser = await UserModel.create({ username, email, password, profile });
    res.status(201).json({ msg: 'Usuario creado', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear usuario' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.status(200).json({ msg: 'Usuario actualizado', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
};

// eliminacion logica y en cascada
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.isDeleted = true;
    await user.save();

    // eliminar en cascada los posts del user 
    await PostModel.updateMany({ author: user._id }, { isDeleted: true });

    res.status(200).json({ msg: 'Usuario eliminado y sus posts eliminados' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
};
//profile embebido 
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user || user.isDeleted) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.status(200).json(user.profile || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user || user.isDeleted) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.profile = { ...(user.profile || {}), ...req.body };
    await user.save();
    res.status(200).json({ msg: 'Profile actualizado', profile: user.profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar profile' });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user || user.isDeleted) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.profile = undefined;
    await user.save();
    res.status(200).json({ msg: 'Profile eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar profile' });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  deleteProfile,
};
