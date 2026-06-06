import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiCalendar, FiCheck, FiClock, FiRefreshCw, FiX } from "react-icons/fi";
import { API_BASE_URL } from "../../config/api";

const Admin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  };

  const fetchReservations = async () => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/reservation`, authConfig);
      setReservations(data.reservations || []);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const counts = useMemo(
    () =>
      reservations.reduce(
        (total, reservation) => {
          const status = reservation.status || "pending";
          total[status] += 1;
          total.all += 1;
          return total;
        },
        { all: 0, pending: 0, approved: 0, cancelled: 0 }
      ),
    [reservations]
  );

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const { data } = await axios.patch(
        `${API_BASE_URL}/reservation/${id}/status`,
        { status },
        authConfig
      );

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation._id === id ? data.reservation : reservation
        )
      );
      toast.success(data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to update reservation");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(date));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <section className="adminPanel">
      <div className="adminShell">
        <header className="adminHeader">
          <div>
            <p className="adminEyebrow">Reservation Desk</p>
            <h1>Admin Panel</h1>
          </div>
          <div className="adminHeaderActions">
            <button onClick={fetchReservations} disabled={loading}>
              <FiRefreshCw />
              Refresh
            </button>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/">Back to Site</Link>
          </div>
        </header>

        <div className="adminStats">
          <div>
            <span>Total</span>
            <strong>{counts.all}</strong>
          </div>
          <div>
            <span>Pending</span>
            <strong>{counts.pending}</strong>
          </div>
          <div>
            <span>Approved</span>
            <strong>{counts.approved}</strong>
          </div>
          <div>
            <span>Cancelled</span>
            <strong>{counts.cancelled}</strong>
          </div>
        </div>

        <div className="adminTableWrap">
          {loading ? (
            <div className="adminState">Loading reservation requests...</div>
          ) : reservations.length === 0 ? (
            <div className="adminState">No reservation requests yet.</div>
          ) : (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Schedule</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      <strong>
                        {reservation.firstName} {reservation.lastName}
                      </strong>
                      <span>Requested {formatDate(reservation.createdAt)}</span>
                    </td>
                    <td>
                      <div className="adminMeta">
                        <FiCalendar />
                        {formatDate(reservation.date)}
                      </div>
                      <div className="adminMeta">
                        <FiClock />
                        {reservation.time}
                      </div>
                    </td>
                    <td>
                      <strong>{reservation.phone}</strong>
                      <span>{reservation.email}</span>
                    </td>
                    <td>
                      <span className={`statusPill ${reservation.status || "pending"}`}>
                        {reservation.status || "pending"}
                      </span>
                    </td>
                    <td>
                      <div className="adminActions">
                        <button
                          className="approveBtn"
                          disabled={
                            updatingId === reservation._id ||
                            reservation.status === "approved"
                          }
                          onClick={() => updateStatus(reservation._id, "approved")}
                        >
                          <FiCheck />
                          Approve
                        </button>
                        <button
                          className="cancelBtn"
                          disabled={
                            updatingId === reservation._id ||
                            reservation.status === "cancelled"
                          }
                          onClick={() => updateStatus(reservation._id, "cancelled")}
                        >
                          <FiX />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default Admin;
