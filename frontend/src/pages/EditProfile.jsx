import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "", // url stored in database
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("bbsUser"));
        if (!stored || !stored.token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URI}/auth/me`, {
          headers: {
            Authorization: `Bearer ${stored.token}`,
          },
        });

        const data = res.data;

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          profileImage: data.profileImage || "",
        });
        setPreviewUrl(data.profileImage || "");

        stored.user = data;
        localStorage.setItem("bbsUser", JSON.stringify(stored));

        setLoading(false);
      } catch (error) {
        console.error("Failed to load user:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // clean up object URL when component unloads or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  const handleSave = async () => {
    setSaving(true);

    try {
      const stored = JSON.parse(localStorage.getItem("bbsUser"));
      if (!stored || !stored.token) {
        navigate("/login");
        return;
      }

      let profileUrl = form.profileImage;

      // if user selected a new file, upload it first
      if (selectedFile) {
        const fd = new FormData();
        fd.append("files", selectedFile);

        const uploadRes = await axios.post(
          `${import.meta.env.VITE_API_URI}/media/upload`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${stored.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // response structure: { ok: true, items: [{ url: ... }, ...] }
        if (uploadRes.data && uploadRes.data.items && uploadRes.data.items[0]) {
          profileUrl = uploadRes.data.items[0].url;
        }
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URI}/auth/me`,
        { ...form, profileImage: profileUrl },
        {
          headers: {
            Authorization: `Bearer ${stored.token}`,
          },
        }
      );

      const data = res.data;

      stored.user = data.user;
      localStorage.setItem("bbsUser", JSON.stringify(stored));

      alert("Profile updated successfully!");
      navigate("/user-settings");
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f6f6f6] p-5">
      <h2 className="text-2xl font-semibold mb-5">Edit Profile</h2>

      <div className="bg-white p-5 rounded shadow space-y-4">
        {/* profile image preview / upload */}
        <div className="flex items-center space-x-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="avatar preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
              {form.name.charAt(0) || "U"}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                setSelectedFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          className="w-full p-3 border rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-black text-white rounded mt-4"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>

        <button
          onClick={() => navigate("/user-settings")}
          className="w-full py-3 bg-gray-300 text-black rounded mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
