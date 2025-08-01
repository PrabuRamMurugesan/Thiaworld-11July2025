import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
} from "react-bootstrap";
import { MdCancel } from "react-icons/md";
// Utility: download CSV helper
const downloadCSV = (data) => {
  const headers = [
    "Market Price",
    "24K",
    "22K",
    "18K",
    "Source",
    "Effective Date",
  ];
  const rows = data.map((r) => [
    r.marketPrice,
    r.rate24?.toFixed(2),
    r.rate22?.toFixed(2),
    r.rate18?.toFixed(2),
    r.source,
    new Date(r.effectiveDate).toLocaleDateString(),
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "gold_rates_grouped.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const GoldRateManager = () => {
  const [marketPrice, setMarketPrice] = useState(0);
  const [source, setSource] = useState("Manual");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("All");

  const fetchGroups = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URI}/goldrate/grouped?metalType=Gold`
    );
    setGroups(res.data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAdd = async () => {
    if (source === "MMTC-PAMP") {
      setMessage("MMTC-PAMP is automated by cron.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URI}/goldrate/create`, {
        metalType: "Gold",
        source,
        marketPrice,
        effectiveDate,
      });
      setMessage("Added new block (24K, 22K, 18K)");
      fetchGroups();
    } catch (err) {
      console.error(err);
      setMessage("Error: " + err.message);
    }
  };

  const handleEdit = (group) => {
    setEditingKey(`${group.effectiveDate}_${group.source}`);
    setEditingData({ ...group });
  };

  const handleUpdate = async () => {
    try {
      // Update all 3
      await axios.put(
        `${import.meta.env.VITE_API_URI}/goldrate/update/${editingData._id24}`,
        {
          marketPrice: editingData.marketPrice,
          ratePerGram: editingData.rate24,
        }
      );
      await axios.put(
        `${import.meta.env.VITE_API_URI}/goldrate/update/${editingData._id22}`,
        {
          marketPrice: editingData.marketPrice,
          ratePerGram: editingData.rate22,
        }
      );
      await axios.put(
        `${import.meta.env.VITE_API_URI}/goldrate/update/${editingData._id18}`,
        {
          marketPrice: editingData.marketPrice,
          ratePerGram: editingData.rate18,
        }
      );
      setMessage("Block updated!");
      setEditingKey(null);
      fetchGroups();
    } catch (err) {
      console.error(err);
      setMessage("Error: " + err.message);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingData({});
  };

  const handleDelete = async (group) => {
    if (window.confirm("Delete entire block?")) {
      await axios.delete(
        `${import.meta.env.VITE_API_URI}/goldrate/delete/${group._id24}`
      );
      await axios.delete(
        `${import.meta.env.VITE_API_URI}/goldrate/delete/${group._id22}`
      );
      await axios.delete(
        `${import.meta.env.VITE_API_URI}/goldrate/delete/${group._id18}`
      );
      fetchGroups();
    }
  };

  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.source
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterSource === "All" || g.source === filterSource;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Container fluid className=" border mx-auto p-3   vh-100 bg-light ">
        <div className="d-flex justify-content-between align-items-center p-3 ">
          <h3
            style={{
              fontFamily: "Poppins",
              fontWeight: "bold",
              fontSize: "28px",
            }}
          >
            Gold Rate Manager
          </h3>
          <a href="/">
            {" "}
            <span>
              <MdCancel
                style={{
                  color: "white",
                  fontSize: "25px",
                  backgroundColor: "gray",
                  borderRadius: "50%",
                  padding: "1px",
                }}
              />
            </span>
          </a>
        </div>
        {message && <Alert variant="info">{message}</Alert>}

        <div className="d-flex  flex-column justify-content-between  p-3  border ">
          {/* Add New Block */}
          <Form className="mb-4 ">
            <Row className="d-flex justify-content-between">
              <Col md={3}>
                <Form.Label>Source</Form.Label>
                <Form.Select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option>Manual</option>
                  <option>MMTC-PAMP</option>
                </Form.Select>
              </Col>
              {source === "Manual" && (
                <Col md={3}>
                  <Form.Label>24K Market Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                  />
                </Col>
              )}
              <Col md={3}>
                <Form.Label>Effective Date</Form.Label>
                <Form.Control
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button onClick={handleAdd}>Add</Button>
              </Col>
            </Row>
          </Form>

          {/* Search + Filter + Download */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Control
                placeholder="Search source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <option>All</option>
                <option>Manual</option>
                <option>MMTC-PAMP</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button
                variant="success"
                onClick={() => downloadCSV(filteredGroups)}
              >
                Download CSV
              </Button>
            </Col>
          </Row>

          {/* Grouped Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Market Price</th>
                <th>24K</th>
                <th>22K</th>
                <th>18K</th>
                <th>Source</th>
                <th>Effective Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => {
                const isEditing =
                  editingKey === `${group.effectiveDate}_${group.source}`;
                return (
                  <tr key={`${group._id24}`}>
                    <td>
                      {isEditing ? (
                        <Form.Control
                          type="number"
                          value={editingData.marketPrice}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              marketPrice: e.target.value,
                            })
                          }
                        />
                      ) : (
                        group.marketPrice
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <Form.Control
                          type="number"
                          value={editingData.rate24}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              rate24: e.target.value,
                            })
                          }
                        />
                      ) : (
                        group.rate24?.toFixed(2)
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <Form.Control
                          type="number"
                          value={editingData.rate22}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              rate22: e.target.value,
                            })
                          }
                        />
                      ) : (
                        group.rate22?.toFixed(2)
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <Form.Control
                          type="number"
                          value={editingData.rate18}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              rate18: e.target.value,
                            })
                          }
                        />
                      ) : (
                        group.rate18?.toFixed(2)
                      )}
                    </td>
                    <td>{group.source}</td>
                    <td>
                      {new Date(group.effectiveDate).toLocaleDateString()}
                    </td>
                    <td>
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={handleUpdate}
                          >
                            Save
                          </Button>{" "}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => handleEdit(group)}>
                            Edit
                          </Button>{" "}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(group)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default GoldRateManager;
