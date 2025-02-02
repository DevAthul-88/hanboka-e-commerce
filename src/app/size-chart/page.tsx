import React from "react"
import MainLayout from "../Layout/MainLayout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Size Chart",
  description: "Size Chart page",
}

function page() {
  return (
    <MainLayout>
      <main style={{ paddingTop: 60 }}>
        <div className="mb-4 pb-4" />
        <section className="size-chart container">
          <div className="mw-930">
            <h2 className="page-title mb-4">SIZE CHART</h2>
            <p className="fs-6 fw-medium mb-4">
              To help you find the perfect fit, we've created a detailed size chart for our Korean
              dresses. Please refer to the measurements below before placing your order.
            </p>
          </div>
          <div className="size-chart__content pb-5 mb-5">
            <div className="mw-930">
              <h3 className="mb-4">Women's Size Chart</h3>
              <table className="table table-bordered mb-5">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (cm)</th>
                    <th>Waist (cm)</th>
                    <th>Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>80-84</td>
                    <td>60-64</td>
                    <td>86-90</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>84-88</td>
                    <td>64-68</td>
                    <td>90-94</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>88-92</td>
                    <td>68-72</td>
                    <td>94-98</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>92-96</td>
                    <td>72-76</td>
                    <td>98-102</td>
                  </tr>
                </tbody>
              </table>
              <h3 className="mb-4">Men's Size Chart</h3>
              <table className="table table-bordered mb-5">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (cm)</th>
                    <th>Waist (cm)</th>
                    <th>Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>84-88</td>
                    <td>68-72</td>
                    <td>88-92</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>88-92</td>
                    <td>72-76</td>
                    <td>92-96</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>92-96</td>
                    <td>76-80</td>
                    <td>96-100</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>96-100</td>
                    <td>80-84</td>
                    <td>100-104</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mw-930">
              <h3 className="mb-4">How to Measure</h3>
              <ul className="list-unstyled">
                <li>
                  <strong>Bust:</strong> Measure around the fullest part of your chest.
                </li>
                <li>
                  <strong>Waist:</strong> Measure around the narrowest part of your waist.
                </li>
                <li>
                  <strong>Hips:</strong> Measure around the fullest part of your hips.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}

export default page
